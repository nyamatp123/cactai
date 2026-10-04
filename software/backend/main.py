from fastapi import FastAPI, HTTPException, Depends, Request, Response, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg
from db import get_connection
import bcrypt
import math
import os
import secrets
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import jwt

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set")

# Shared secret the ESP32 sends in the X-Device-Key header
DEVICE_KEY = os.getenv("DEVICE_KEY")
if not DEVICE_KEY:
    raise RuntimeError("DEVICE_KEY environment variable is not set")

TOKEN_HOURS = 24
COOKIE_NAME = "access_token"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # TODO: add production frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Auth helpers ----------

def get_current_user_id(request: Request) -> int:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid session")
    return int(payload["sub"])

def require_device(x_device_key: str | None = Header(default=None)):
    # Compare as bytes: compare_digest raises on non-ASCII str input
    if x_device_key is None or not secrets.compare_digest(
        x_device_key.encode(), DEVICE_KEY.encode()
    ):
        raise HTTPException(status_code=401, detail="Invalid device key")


# ---------- Users and auth ----------

class NewUser(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str

USER_COLUMNS = "id, username, email, first_name, last_name, created_at"

def user_row(r):
    return {
        "id": r[0], "username": r[1], "email": r[2],
        "first_name": r[3], "last_name": r[4], "created_at": r[5],
    }

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

@app.post("/users", status_code=201)
def create_user(user: NewUser):
    first_name, last_name = user.first_name.strip(), user.last_name.strip()
    if not first_name or not last_name:
        raise HTTPException(status_code=422, detail="Enter your first and last name")
    try:
        with get_connection() as conn:
            row = conn.execute(
                "INSERT INTO users (username, email, password_hash, first_name, last_name) "
                f"VALUES (%s, %s, %s, %s, %s) RETURNING {USER_COLUMNS}",
                (user.username, user.email, hash_password(user.password), first_name, last_name),
            ).fetchone()
    except psycopg.errors.UniqueViolation:
        raise HTTPException(status_code=409, detail="Username or email already taken")
    return user_row(row)

class LoginData(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(data: LoginData, response: Response):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, password_hash FROM users WHERE email = %s",
            (data.email,)
        ).fetchone()

    if row is None or not bcrypt.checkpw(data.password.encode(), row[1].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = jwt.encode(
        {"sub": str(row[0]), "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS)},
        SECRET_KEY,
        algorithm="HS256",
    )
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,               # JavaScript can't read it
        samesite="lax",
        secure=False,                # TODO: set True in production (HTTPS only)
        max_age=TOKEN_HOURS * 3600,  # browser deletes it after this many seconds
    )
    return {"ok": True}

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME)
    return {"ok": True}

@app.get("/me")
def me(user_id: int = Depends(get_current_user_id)):
    with get_connection() as conn:
        row = conn.execute(
            f"SELECT {USER_COLUMNS} FROM users WHERE id = %s", (user_id,)
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user_row(row)

class ProfileChanges(BaseModel):
    first_name: str
    last_name: str
    email: str

# Username can't be changed here on purpose
@app.patch("/me")
def update_me(changes: ProfileChanges, user_id: int = Depends(get_current_user_id)):
    first_name, last_name = changes.first_name.strip(), changes.last_name.strip()
    email = changes.email.strip()
    if not first_name or not last_name:
        raise HTTPException(status_code=422, detail="Enter your first and last name")
    if "@" not in email:
        raise HTTPException(status_code=422, detail="Enter a valid email address")
    try:
        with get_connection() as conn:
            row = conn.execute(
                "UPDATE users SET first_name = %s, last_name = %s, email = %s "
                f"WHERE id = %s RETURNING {USER_COLUMNS}",
                (first_name, last_name, email, user_id),
            ).fetchone()
    except psycopg.errors.UniqueViolation:
        raise HTTPException(status_code=409, detail="That email is already used by another account")
    if row is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user_row(row)

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@app.post("/me/password")
def change_password(data: PasswordChange, user_id: int = Depends(get_current_user_id)):
    if len(data.new_password) < 8:
        raise HTTPException(status_code=422, detail="Your new password needs at least 8 characters")
    with get_connection() as conn:
        row = conn.execute(
            "SELECT password_hash FROM users WHERE id = %s", (user_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=401, detail="User not found")
        if not bcrypt.checkpw(data.current_password.encode(), row[0].encode()):
            raise HTTPException(status_code=400, detail="Your current password is incorrect")
        conn.execute(
            "UPDATE users SET password_hash = %s WHERE id = %s",
            (hash_password(data.new_password), user_id),
        )
    return {"ok": True}


# ---------- Plants (logged-in user only) ----------

class NewPlant(BaseModel):
    name: str
    species: str | None = None
    device_id: str | None = None  # optional until ESP32 pairing is set up
    location: str | None = None
    drainage: bool | None = None
    acquired_at: datetime | None = None

PLANT_COLUMNS = "id, name, species, device_id, location, drainage, acquired_at"

def plant_row(r):
    return {
        "id": r[0], "name": r[1], "species": r[2], "device_id": r[3],
        "location": r[4], "drainage": r[5], "acquired_at": r[6],
    }

@app.post("/plants", status_code=201)
def create_plant(plant: NewPlant, user_id: int = Depends(get_current_user_id)):
    try:
        with get_connection() as conn:
            row = conn.execute(
                "INSERT INTO plants (user_id, name, species, device_id, location, drainage, acquired_at) "
                f"VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING {PLANT_COLUMNS}",
                (user_id, plant.name, plant.species, plant.device_id,
                 plant.location, plant.drainage, plant.acquired_at),
            ).fetchone()
    except psycopg.errors.UniqueViolation:
        raise HTTPException(status_code=409, detail="That device is already paired to a plant")
    return plant_row(row)

@app.get("/plants")
def list_plants(user_id: int = Depends(get_current_user_id)):
    with get_connection() as conn:
        rows = conn.execute(
            f"SELECT {PLANT_COLUMNS} FROM plants WHERE user_id = %s ORDER BY id",
            (user_id,)
        ).fetchall()
    return [plant_row(r) for r in rows]

class PlantChanges(BaseModel):
    name: str | None = None
    species: str | None = None
    device_id: str | None = None
    location: str | None = None
    drainage: bool | None = None
    acquired_at: datetime | None = None

# Only the fields sent are changed; keys come from the model, so they're safe to put in SQL
@app.patch("/plants/{plant_id}")
def update_plant(plant_id: int, changes: PlantChanges, user_id: int = Depends(get_current_user_id)):
    fields = changes.model_dump(exclude_unset=True)
    if "name" in fields and not (fields["name"] or "").strip():
        raise HTTPException(status_code=422, detail="Name can't be empty")

    try:
        with get_connection() as conn:
            if fields:
                set_clause = ", ".join(f"{col} = %s" for col in fields)
                row = conn.execute(
                    f"UPDATE plants SET {set_clause} WHERE id = %s AND user_id = %s "
                    f"RETURNING {PLANT_COLUMNS}",
                    (*fields.values(), plant_id, user_id),
                ).fetchone()
            else:
                row = conn.execute(
                    f"SELECT {PLANT_COLUMNS} FROM plants WHERE id = %s AND user_id = %s",
                    (plant_id, user_id),
                ).fetchone()
    except psycopg.errors.UniqueViolation:
        raise HTTPException(status_code=409, detail="That device is already paired to a plant")
    if row is None:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant_row(row)

# Readings for the plant are removed too (ON DELETE CASCADE).
# A user must keep at least one plant; removing everything means deleting the account.
@app.delete("/plants/{plant_id}", status_code=204)
def delete_plant(plant_id: int, user_id: int = Depends(get_current_user_id)):
    with get_connection() as conn:
        # Lock the user's plants so two deletes at once can't remove the last two
        owned = conn.execute(
            "SELECT id FROM plants WHERE user_id = %s FOR UPDATE", (user_id,)
        ).fetchall()
        if plant_id not in {r[0] for r in owned}:
            raise HTTPException(status_code=404, detail="Plant not found")
        if len(owned) <= 1:
            raise HTTPException(status_code=409, detail="You need at least one plant")
        conn.execute("DELETE FROM plants WHERE id = %s", (plant_id,))


# ---------- Sensor readings ----------

class NewReading(BaseModel):
    device_id: str
    moisture_pct: float | None
    lux: float | None
    weight_g: float | None
    health_score: float | None
    soil_raw: int | None

# A failed sensor arrives as null (or -1 from the firmware) and is stored as
# NULL, never 0 or -1. NaN/Infinity and any negative value are treated the same
# way, since none of these readings can really be below zero.
def sensor_value(x):
    return x if x is not None and math.isfinite(x) and x >= 0 else None

def clamp_pct(x):
    return None if x is None else max(0.0, min(100.0, x))

# recorded_at comes from the database default; the device clock isn't trusted
@app.post("/readings", status_code=201, dependencies=[Depends(require_device)])
def create_reading(reading: NewReading):
    lux = sensor_value(reading.lux)

    with get_connection() as conn:
        plant = conn.execute(
            "SELECT id FROM plants WHERE device_id = %s", (reading.device_id,)
        ).fetchone()
        if plant is None:
            raise HTTPException(status_code=404, detail="No plant paired with this device")
        row = conn.execute(
            "INSERT INTO sensor_readings "
            "(plant_id, moisture_pct, lux, weight_g, health_score, soil_raw) "
            "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, recorded_at",
            (plant[0], clamp_pct(sensor_value(reading.moisture_pct)), lux,
             sensor_value(reading.weight_g), clamp_pct(sensor_value(reading.health_score)),
             reading.soil_raw),
        ).fetchone()
    return {"id": row[0], "plant_id": plant[0], "recorded_at": row[1]}

def round_or_none(x, digits=None):
    return None if x is None else round(x, digits)

def reading_out(t, moisture, light, weight, health):
    return {
        "t": t,
        "moisture": round_or_none(moisture, 1),
        "light": round_or_none(light),  # whole number
        "weight": round_or_none(weight, 1),
        "health": round_or_none(health, 1),
    }

def utc_iso(t):
    return t.astimezone(timezone.utc).isoformat()

@app.get("/plants/{plant_id}/readings")
def plant_readings(
    plant_id: int,
    range_: str = Query("day", alias="range", pattern="^(day|week)$"),
    tz: str = "UTC",
    user_id: int = Depends(get_current_user_id),
):
    try:
        ZoneInfo(tz)
    except (ZoneInfoNotFoundError, ValueError):
        raise HTTPException(status_code=400, detail="Unknown time zone")

    with get_connection() as conn:
        # 404 rather than 403 so other users' plant ids can't be probed
        owned = conn.execute(
            "SELECT 1 FROM plants WHERE id = %s AND user_id = %s", (plant_id, user_id)
        ).fetchone()
        if owned is None:
            raise HTTPException(status_code=404, detail="Plant not found")

        if range_ == "day":
            # Last 24 hours in 15-minute buckets
            rows = conn.execute(
                "SELECT date_bin('15 minutes', recorded_at, TIMESTAMPTZ '2000-01-01') AS t, "
                "AVG(moisture_pct), AVG(lux), AVG(weight_g), AVG(health_score) "
                "FROM sensor_readings "
                "WHERE plant_id = %s AND recorded_at >= now() - INTERVAL '24 hours' "
                "GROUP BY t ORDER BY t",
                (plant_id,),
            ).fetchall()
            out = [reading_out(utc_iso(r[0]), *r[1:]) for r in rows]
        else:
            # Today plus the 6 days before it, as calendar days in the user's time zone.
            # Light is the daily peak, not the average.
            try:
                rows = conn.execute(
                    "SELECT date_trunc('day', recorded_at AT TIME ZONE %s) AS day, "
                    "AVG(moisture_pct), MAX(lux), AVG(weight_g), AVG(health_score) "
                    "FROM sensor_readings "
                    "WHERE plant_id = %s "
                    "AND recorded_at >= (date_trunc('day', now() AT TIME ZONE %s) - INTERVAL '6 days') AT TIME ZONE %s "
                    "GROUP BY day ORDER BY day",
                    (tz, plant_id, tz, tz),
                ).fetchall()
            except psycopg.errors.InvalidParameterValue:
                # Python knows the zone but Postgres doesn't
                raise HTTPException(status_code=400, detail="Unknown time zone")
            out = [reading_out(r[0].date().isoformat(), *r[1:]) for r in rows]

        latest = conn.execute(
            "SELECT recorded_at, moisture_pct, lux, weight_g, health_score "
            "FROM sensor_readings WHERE plant_id = %s "
            "ORDER BY recorded_at DESC LIMIT 1",
            (plant_id,),
        ).fetchone()

    return {
        "range": range_,
        "rows": out,
        "latest": reading_out(utc_iso(latest[0]), *latest[1:]) if latest else None,
    }

# ---------- Cactai chat (Gemini) ----------
# Route lives in chat_routes.py; requires login like the routes above
from chat_routes import router as chat_router
app.include_router(chat_router, dependencies=[Depends(get_current_user_id)])

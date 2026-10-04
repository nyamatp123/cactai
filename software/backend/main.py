from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg
from db import get_connection
import bcrypt
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set")

bearer = HTTPBearer()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # TODO: restrict before deploying
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewPlant(BaseModel):
    user_id: int
    name: str
    species: str | None = None

@app.post("/plants")
def create_plant(plant: NewPlant):
    try:
        with get_connection() as conn:
            row = conn.execute(
                "INSERT INTO plants (user_id, name, species) "
                "VALUES (%s, %s, %s) RETURNING id, user_id, name, species",
                (plant.user_id, plant.name, plant.species),
            ).fetchone()
    except psycopg.errors.ForeignKeyViolation:
        raise HTTPException(status_code=404, detail="User does not exist")
    
    return {"id": row[0], "user_id": row[1], "name": row[2], "species": row[3]}

@app.get("/users/{user_id}/plants")
def list_plants(user_id: int):
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, name, species FROM plants WHERE user_id = %s ORDER BY id",
            (user_id,)
        ).fetchall()
    return [{"id": r[0], "name": r[1], "species": r[2]} for r in rows]

class NewUser(BaseModel):
    username: str
    email: str
    password: str

@app.post("/users", status_code=201)
def create_user(user: NewUser):
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    try:
        with get_connection() as conn:
            row = conn.execute(
                "INSERT INTO users (username, email, password_hash) "
                "VALUES (%s, %s, %s) RETURNING id, username, email, created_at",
                (user.username, user.email, password_hash),
            ).fetchone()
    except psycopg.errors.UniqueViolation:
        raise HTTPException(status_code=409, detail="Username or email already taken")
    return {"id": row[0], "username": row[1], "email": row[2], "created_at": row[3]}

class LoginData(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(data: LoginData):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, password_hash FROM users WHERE username = %s",
            (data.username,)
        ).fetchone()

    if row is None or not bcrypt.checkpw(data.password.encode(), row[1].encode()):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = jwt.encode(
        {"sub": str(row[0]), "exp": datetime.now(timezone.utc) + timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256",
    )
    return {"access_token": token, "token_type": "bearer"}

class NewReading(BaseModel):
    device_id: str
    moisture: float | None = None
    soil_raw: int | None = None
    lux: float | None = None
    weight_g: float | None = None
    weight_raw: int | None = None
    health: float | None = None

# Called by the ESP32 every 15 minutes
@app.post("/readings", status_code=201)
def create_reading(reading: NewReading):
    with get_connection() as conn:
        row = conn.execute(
            "INSERT INTO readings (device_id, moisture, soil_raw, lux, weight_g, weight_raw, health) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, recorded_at",
            (reading.device_id, reading.moisture, reading.soil_raw, reading.lux,
             reading.weight_g, reading.weight_raw, reading.health),
        ).fetchone()
    return {"id": row[0], "recorded_at": row[1]}

@app.get("/readings")
def list_readings(device_id: str, limit: int = Query(100, ge=1, le=1000)):
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, recorded_at, moisture, soil_raw, lux, weight_g, weight_raw, health "
            "FROM readings WHERE device_id = %s ORDER BY recorded_at DESC LIMIT %s",
            (device_id, limit),
        ).fetchall()
    return [
        {"id": r[0], "recorded_at": r[1], "moisture": r[2], "soil_raw": r[3], "lux": r[4],
         "weight_g": r[5], "weight_raw": r[6], "health": r[7]}
        for r in rows
    ]

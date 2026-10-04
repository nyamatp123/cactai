from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg
from db import get_connection
import bcrypt
import os
from datetime import datetime, timedelta, timezone

import jwt

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set")

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


# ---------- Users and auth ----------

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
            "SELECT id, username, email FROM users WHERE id = %s", (user_id,)
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="User not found")
    return {"id": row[0], "username": row[1], "email": row[2]}


# ---------- Plants (logged-in user only) ----------

class NewPlant(BaseModel):
    name: str
    species: str | None = None

@app.post("/plants", status_code=201)
def create_plant(plant: NewPlant, user_id: int = Depends(get_current_user_id)):
    with get_connection() as conn:
        row = conn.execute(
            "INSERT INTO plants (user_id, name, species) "
            "VALUES (%s, %s, %s) RETURNING id, user_id, name, species",
            (user_id, plant.name, plant.species),
        ).fetchone()
    return {"id": row[0], "user_id": row[1], "name": row[2], "species": row[3]}

@app.get("/plants")
def list_plants(user_id: int = Depends(get_current_user_id)):
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, name, species FROM plants WHERE user_id = %s ORDER BY id",
            (user_id,)
        ).fetchall()
    return [{"id": r[0], "name": r[1], "species": r[2]} for r in rows]

# ---------- Cactai chat (Gemini) ----------
# Route lives in chat_routes.py; requires login like the routes above
from chat_routes import router as chat_router
app.include_router(chat_router, dependencies=[Depends(get_current_user_id)])

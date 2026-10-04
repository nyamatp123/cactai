from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg
from db import get_connection
import bcrypt
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends
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
    email: str
    password: str

@app.post("/login")
def login(data: LoginData):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, password_hash FROM users WHERE email = %s",
            (data.email,)
        ).fetchone()

    if row is None or not bcrypt.checkpw(data.password.encode(), row[1].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = jwt.encode(
        {"sub": str(row[0]), "exp": datetime.now(timezone.utc) + timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256",
    )
    return {"access_token": token, "token_type": "bearer"}
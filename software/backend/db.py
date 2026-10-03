import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg.connect(
        host="127.0.0.1",
        port=5432,
        dbname="cactai",
        user="postgres",
        password=os.getenv("DB_PASSWORD"),
    )
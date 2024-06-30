# app/config.py
import os


#DATABASE_URL = "sqlite+aiosqlite:///./test.db"

DATABASE_URL = os.getenv("DATABASE_URL")
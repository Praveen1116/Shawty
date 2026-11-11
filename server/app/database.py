import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

RAW_DATABASE_URL = os.getenv("DATABASE_URL")

if not RAW_DATABASE_URL:
    raise ValueError("DATABASE_URL is missing")

DATABASE_URL = RAW_DATABASE_URL.replace(
    "postgresql://",
    "postgresql+psycopg://",
    1,
)

engine = create_async_engine(
    DATABASE_URL,
    poolclass=NullPool,
)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db_session():
    async with SessionLocal() as session:
        yield session

async def get_db_connection():
    return await psycopg.AsyncConnection.connect(RAW_DATABASE_URL)


async def get_db_connection():
    return await psycopg.AsyncConnection.connect(RAW_DATABASE_URL)
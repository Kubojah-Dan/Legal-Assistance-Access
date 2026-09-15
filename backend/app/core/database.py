import uuid
from datetime import datetime, timezone
from typing import AsyncGenerator

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.core.config import get_settings

settings = get_settings()

# Determine database URL and connect args
DATABASE_URL = settings.DATABASE_URL
connect_args: dict = {}

if settings.USE_SQLITE_FALLBACK or "sqlite" in DATABASE_URL:
    # Use SQLite for development / local testing if Postgres is not configured
    sqlite_path = settings.SQLITE_DB_PATH.replace("\\", "/")
    DATABASE_URL = f"sqlite+aiosqlite:///{sqlite_path}"
    connect_args = {"check_same_thread": False}

engine = create_async_engine(
    DATABASE_URL,
    echo=settings.DEBUG,
    connect_args=connect_args,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    """Base model providing standard UUID primary key and timestamp audit fields."""

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that yields an async database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database schema tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

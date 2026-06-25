from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import StaticPool
from app.core.config import settings

# SQLite uses StaticPool (dev). PostgreSQL uses default connection pool (prod/docker).
_is_sqlite = settings.DATABASE_URL.startswith("sqlite")

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    # SQLite requires connect_args and StaticPool for async use
    **(dict(
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    ) if _is_sqlite else dict(
        pool_size=10,
        max_overflow=20,
    ))
)

# Create session maker
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Dependency to get db session in endpoints
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

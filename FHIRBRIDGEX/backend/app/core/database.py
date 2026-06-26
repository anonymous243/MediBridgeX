from collections.abc import Generator
import logging

from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


logger = logging.getLogger(__name__)

connect_args = {}
if settings.database_url.startswith("postgresql+psycopg"):
    connect_args = {"connect_timeout": 5}

engine = create_engine(settings.database_url, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE hl7_messages ADD COLUMN IF NOT EXISTS fhir_json JSONB"))
            connection.execute(text("ALTER TABLE hl7_messages ADD COLUMN IF NOT EXISTS fhir_submission_results JSONB"))
            connection.execute(text("ALTER TABLE patients ADD COLUMN IF NOT EXISTS fhir_submission_results JSONB"))
    except SQLAlchemyError as exc:
        logger.warning("Database initialization skipped: %s", exc)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

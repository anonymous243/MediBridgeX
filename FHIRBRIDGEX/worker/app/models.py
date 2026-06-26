from datetime import datetime, timezone

from typing import Any

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class HL7Record(Base):
    __tablename__ = "hl7_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    message_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    message_type: Mapped[str] = mapped_column(String(32), nullable=False)
    raw_message: Mapped[str] = mapped_column(Text, nullable=False)
    fhir_json: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    fhir_submission_results: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONB, nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="processed")
    processed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.hl7_record import HL7Record


def get_hl7_message_type(message: str) -> str:
    first_segment = message.splitlines()[0] if message else ""
    if not first_segment.startswith("MSH|"):
        return "unknown"

    fields = first_segment.split("|")
    if len(fields) <= 8:
        return "unknown"

    return fields[8] or "unknown"


def create_queued_hl7_record(db: Session, message_id: str, raw_message: str) -> None:
    db.add(
        HL7Record(
            message_id=message_id,
            message_type=get_hl7_message_type(raw_message),
            raw_message=raw_message,
            status="queued",
            processed_at=datetime.now(timezone.utc),
        )
    )
    db.commit()


def list_hl7_records(db: Session) -> list[dict[str, Any]]:
    records = db.scalars(select(HL7Record).order_by(HL7Record.processed_at.desc())).all()

    return [
        {
            "id": record.message_id,
            "messageType": record.message_type,
            "status": record.status,
            "preview": record.raw_message.splitlines()[0] if record.raw_message else "",
            "processedAt": record.processed_at.isoformat(),
        }
        for record in records
    ]

def update_hl7_record_status(db: Session, message_id: str, status: str) -> None:
    record = db.scalars(select(HL7Record).filter_by(message_id=message_id)).first()
    if record:
        record.status = status
        db.commit()

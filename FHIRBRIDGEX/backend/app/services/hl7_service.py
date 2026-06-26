from uuid import uuid4

from sqlalchemy.orm import Session

from app.core.config import settings
from app.services.hl7_record_service import create_queued_hl7_record
from app.services.rabbitmq_producer import publish_message


def queue_hl7_message(db: Session, message: str) -> dict[str, str]:
    cleaned_message = message.strip()
    if not cleaned_message:
        raise ValueError("HL7 message cannot be empty")

    if not cleaned_message.startswith("MSH|"):
        raise ValueError("HL7 message must start with an MSH segment")

    message_id = str(uuid4())
    create_queued_hl7_record(db, message_id, cleaned_message)
    publish_message(
        settings.hl7_queue_name,
        {
            "id": message_id,
            "type": "hl7",
            "message": cleaned_message,
        },
    )

    return {
        "status": "accepted",
        "message_id": message_id,
        "queue": settings.hl7_queue_name,
    }

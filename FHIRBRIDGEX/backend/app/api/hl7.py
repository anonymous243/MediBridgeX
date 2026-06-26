from fastapi import APIRouter, Body, HTTPException, status, BackgroundTasks
from fastapi import Depends
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.hl7_record_service import list_hl7_records, create_queued_hl7_record, update_hl7_record_status
from app.services.hl7_processor import convert_hl7_to_fhir_patient, auto_submit_fhir_resource
from uuid import uuid4

router = APIRouter()


def database_unavailable_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Database unavailable. Start PostgreSQL and try again.",
    )

def process_hl7_background(message_id: str, message: str, db: Session):
    try:
        update_hl7_record_status(db, message_id, "processing")
        bundle = convert_hl7_to_fhir_patient(message_id, message)
        # We can submit to external here if needed
        # auto_submit_fhir_resource(bundle)
        update_hl7_record_status(db, message_id, "completed")
    except Exception as e:
        update_hl7_record_status(db, message_id, "failed")

@router.post("/hl7", status_code=status.HTTP_202_ACCEPTED)
def receive_hl7_message(
    background_tasks: BackgroundTasks,
    message: str = Body(..., media_type="text/plain"),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    cleaned_message = message.strip()
    if not cleaned_message:
        raise HTTPException(status_code=400, detail="HL7 message cannot be empty")
        
    if not cleaned_message.startswith("MSH|"):
        raise HTTPException(status_code=400, detail="HL7 message must start with an MSH segment")

    try:
        message_id = str(uuid4())
        create_queued_hl7_record(db, message_id, cleaned_message)
        
        # Process in background without RabbitMQ
        background_tasks.add_task(process_hl7_background, message_id, cleaned_message, db)
        
    except SQLAlchemyError as exc:
        raise database_unavailable_error() from exc

    return {
        "status": "accepted",
        "message_id": message_id,
        "queue": "background_tasks",
    }


@router.get("/hl7/messages")
def fetch_hl7_messages(db: Session = Depends(get_db)) -> list[dict]:
    try:
        return list_hl7_records(db)
    except SQLAlchemyError as exc:
        raise database_unavailable_error() from exc

from typing import Any

from fastapi import APIRouter, status

from app.queue import enqueue_fhir_message

router = APIRouter()


@router.post("/messages", status_code=status.HTTP_202_ACCEPTED)
def ingest_fhir_message(payload: dict[str, Any]) -> dict[str, str]:
    message_id = enqueue_fhir_message(payload)
    return {"status": "queued", "message_id": message_id}


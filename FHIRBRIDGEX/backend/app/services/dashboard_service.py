from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.hl7_record import HL7Record
from app.models.patient_record import PatientRecord


def submission_status(results: list[dict[str, Any]] | None) -> str:
    if not results:
        return "queued"
    if any(result.get("ok") for result in results):
        return "accepted"
    return "failed"


def list_dashboard_events(db: Session) -> list[dict[str, Any]]:
    patient_records = db.scalars(select(PatientRecord)).all()
    hl7_records = db.scalars(select(HL7Record)).all()

    events = [
        {
            "id": record.patient_id,
            "source": "JSON Patient",
            "type": "FHIR Patient",
            "status": "processed",
            "submissionStatus": submission_status(record.fhir_submission_results),
            "submissionResults": record.fhir_submission_results or [],
            "timestamp": record.created_at.isoformat(),
        }
        for record in patient_records
    ]

    events.extend(
        {
            "id": record.message_id,
            "source": "HL7",
            "type": record.message_type,
            "status": record.status,
            "submissionStatus": submission_status(record.fhir_submission_results),
            "submissionResults": record.fhir_submission_results or [],
            "timestamp": record.processed_at.isoformat(),
        }
        for record in hl7_records
    )

    return sorted(events, key=lambda event: event["timestamp"], reverse=True)

from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.hl7_record import HL7Record
from app.models.patient_record import PatientRecord


def get_fhir_by_id(db: Session, resource_id: str) -> dict[str, Any] | None:
    patient_record = db.scalar(select(PatientRecord).where(PatientRecord.patient_id == resource_id))
    if patient_record is not None:
        return patient_record.fhir_json

    hl7_record = db.scalar(select(HL7Record).where(HL7Record.message_id == resource_id))
    if hl7_record is not None:
        return hl7_record.fhir_json

    return None

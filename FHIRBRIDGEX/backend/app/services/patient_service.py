from typing import Any
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.patient import PatientCreate
from app.models.patient_record import PatientRecord
from app.services.fhir_mapper import convert_json_patient_to_fhir
from app.services.fhir_submit_service import auto_submit_fhir_resource


def convert_patient_to_fhir(patient: PatientCreate) -> dict[str, Any]:
    return convert_json_patient_to_fhir(patient)


def create_patient(db: Session, patient: PatientCreate) -> dict[str, Any]:
    fhir_patient = convert_patient_to_fhir(patient)
    submission_results = auto_submit_fhir_resource(fhir_patient)
    record = PatientRecord(
        patient_id=fhir_patient["id"],
        fhir_json=fhir_patient,
        fhir_submission_results=submission_results,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record.fhir_json


def get_patient(db: Session, patient_id: str) -> dict[str, Any] | None:
    record = db.scalar(select(PatientRecord).where(PatientRecord.patient_id == patient_id))
    if record is None:
        return None

    return record.fhir_json


def list_patient_records(db: Session) -> list[dict[str, Any]]:
    records = db.scalars(select(PatientRecord).order_by(PatientRecord.created_at.desc())).all()

    return [
        {
            "id": record.patient_id,
            "name": record.fhir_json.get("name", [{}])[0].get("text", "Unknown"),
            "gender": record.fhir_json.get("gender", "unknown"),
            "birthDate": record.fhir_json.get("birthDate", ""),
            "resourceType": record.fhir_json.get("resourceType", "Patient"),
            "createdAt": record.created_at.isoformat(),
        }
        for record in records
    ]

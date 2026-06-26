from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.patient import PatientCreate
from app.services.patient_service import create_patient, get_patient, list_patient_records

router = APIRouter()


def database_unavailable_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Database unavailable. Start PostgreSQL and try again.",
    )


@router.post("/patient", status_code=status.HTTP_201_CREATED)
def accept_patient(patient: PatientCreate, db: Session = Depends(get_db)) -> dict[str, Any]:
    try:
        return create_patient(db, patient)
    except SQLAlchemyError as exc:
        raise database_unavailable_error() from exc


@router.get("/patients/{patient_id}")
def fetch_patient(patient_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    try:
        patient = get_patient(db, patient_id)
    except SQLAlchemyError as exc:
        raise database_unavailable_error() from exc

    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    return patient


@router.get("/patient-records")
def fetch_patient_records(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    try:
        return list_patient_records(db)
    except SQLAlchemyError as exc:
        raise database_unavailable_error() from exc

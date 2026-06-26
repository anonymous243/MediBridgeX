from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.fhir_lookup_service import get_fhir_by_id

router = APIRouter(prefix="/api", tags=["FHIR"])


@router.get("/fhir/{resource_id}")
def fetch_fhir_resource(resource_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    try:
        resource = get_fhir_by_id(db, resource_id)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable. Start PostgreSQL and try again.",
        ) from exc

    if resource is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FHIR resource not found or not processed yet.",
        )

    return resource

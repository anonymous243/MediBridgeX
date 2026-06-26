from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.fhir_lookup_service import get_fhir_by_id
from app.services.fhir_submit_service import submit_fhir_resource

router = APIRouter(prefix="/api", tags=["FHIR"])


class FHIRSubmitRequest(BaseModel):
    resource_id: str
    endpoints: list[str]
    mode: Literal["validate", "submit"] = "validate"
    resource: dict[str, Any] | None = None

    @field_validator("endpoints")
    @classmethod
    def endpoints_must_not_be_empty(cls, value: list[str]) -> list[str]:
        cleaned = [endpoint.strip() for endpoint in value if endpoint.strip()]
        if not cleaned:
            raise ValueError("At least one endpoint is required")
        return cleaned


@router.post("/fhir/submit")
def submit_fhir(request: FHIRSubmitRequest, db: Session = Depends(get_db)) -> dict[str, Any]:
    try:
        resource = get_fhir_by_id(db, request.resource_id)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable. Start PostgreSQL and try again.",
        ) from exc

    if resource is None and request.resource is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FHIR resource not found or not processed yet.",
        )

    try:
        resource_to_submit = request.resource or resource
        results = submit_fhir_resource(resource_to_submit, request.endpoints, request.mode)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return {
        "resourceId": request.resource_id,
        "resourceType": resource_to_submit.get("resourceType"),
        "mode": request.mode,
        "results": results,
    }

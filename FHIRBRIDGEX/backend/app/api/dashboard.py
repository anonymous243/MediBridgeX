from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.dashboard_service import list_dashboard_events

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard-events")
def fetch_dashboard_events(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    try:
        return list_dashboard_events(db)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable. Start PostgreSQL and try again.",
        ) from exc

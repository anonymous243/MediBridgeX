from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.all_models import User, AuditLog
from pydantic import BaseModel, ConfigDict

router = APIRouter()

class AuditUserResponse(BaseModel):
    id: str
    email: str
    name: str | None = None
    role: str

    model_config = ConfigDict(from_attributes=True)

class AuditLogResponse(BaseModel):
    id: str
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    timestamp: datetime
    signature: str
    user: Optional[AuditUserResponse] = None

    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=List[AuditLogResponse])
async def get_audit_logs(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve cryptographically signed audit logs. HIPAA compliant endpoint.
    Only users with auditor/admin/owner roles or specific permissions should access this.
    """
    # Simple role check for this P0 implementation
    if current_user.role not in ["admin", "owner", "auditor"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions to view audit logs")

    # Fetch audit logs with the associated user joined
    from sqlalchemy.orm import selectinload
    query = (
        select(AuditLog)
        .options(selectinload(AuditLog.user))
        .order_by(desc(AuditLog.timestamp))
        .offset(offset)
        .limit(limit)
    )
    result = await db.execute(query)
    logs = result.scalars().all()

    # Log that the user read the audit logs (Audit the Auditors)
    from app.core.audit import log_audit_event
    await log_audit_event(db, current_user.id, "READ", "AuditLog", "bulk")

    return logs

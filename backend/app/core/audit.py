from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.all_models import AuditLog
from app.core.security import sign_audit_log

async def log_audit_event(
    db: AsyncSession,
    user_id: str,
    action: str,
    resource_type: str,
    resource_id: str
):
    """
    Creates a cryptographically signed HIPAA audit log entry.
    This guarantees that the log cannot be silently altered in the database.
    """
    now = datetime.now(timezone.utc)
    # Generate HMAC signature
    signature = sign_audit_log(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        timestamp_iso=now.isoformat()
    )
    
    log_entry = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        timestamp=now,
        signature=signature
    )
    db.add(log_entry)
    # We commit immediately to ensure the audit log is stored before returning data
    await db.commit()

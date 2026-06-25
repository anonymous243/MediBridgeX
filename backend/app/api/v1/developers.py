from datetime import datetime, timezone
import uuid
import secrets
import hashlib
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, ApiKey, WebhookEndpoint

router = APIRouter()

# Schemas
class ApiKeyCreate(BaseModel):
    name: str
    environment: str  # live or test
    scopes: List[str]

class ApiKeySchema(BaseModel):
    id: str
    name: str
    key: str
    status: str
    environment: str
    scopes: List[str]
    createdAt: str
    lastUsedAt: Optional[str] = None
    expiresAt: Optional[str] = None

class WebhookCreate(BaseModel):
    url: str
    events: List[str]
    description: Optional[str] = None

class WebhookEndpointSchema(BaseModel):
    id: str
    url: str
    status: str
    events: List[str]
    description: Optional[str] = None
    createdAt: str
    signingSecret: str

class ApiRequestLogSchema(BaseModel):
    id: str
    method: str
    endpoint: str
    statusCode: int
    latency: int
    timestamp: str
    requestId: str
    correlationId: str
    retryCount: int
    userAgent: str

class ApiRequestLogsResponse(BaseModel):
    data: List[ApiRequestLogSchema]
    meta: dict

class UsageMetricSchema(BaseModel):
    timestamp: str
    requests: int
    errors: int
    latency: int

# Webhooks & logs storage mock/simple
MOCK_WEBHOOKS = [
    WebhookEndpointSchema(
        id="wh_1",
        url="https://api.northshorehealth.org/v1/medibridge-receiver",
        status="active",
        events=["message.delivered", "fhir.patient.created"],
        description="Production clinical endpoint to receive HL7 state-changes.",
        createdAt=datetime.now(timezone.utc).isoformat(),
        signingSecret="whsec_88f9a0b12bc4f52"
    )
]

MOCK_LOGS = [
    ApiRequestLogSchema(
        id="req_1",
        method="POST",
        endpoint="/api/v1/messages/ingest",
        statusCode=200,
        latency=45,
        timestamp=datetime.now(timezone.utc).isoformat(),
        requestId="req_ae88f910b",
        correlationId="corr_9901-ab",
        retryCount=0,
        userAgent="EpicEHRConnector/v2.4"
    ),
    ApiRequestLogSchema(
        id="req_2",
        method="GET",
        endpoint="/api/v1/fhir/resources/Patient",
        statusCode=200,
        latency=110,
        timestamp=datetime.now(timezone.utc).isoformat(),
        requestId="req_bf88f910c",
        correlationId="corr_9902-ac",
        retryCount=0,
        userAgent="MediBridgeXPortal/v1.0"
    )
]

# Endpoints
@router.get("/api-keys", response_model=List[ApiKeySchema])
async def get_api_keys(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.workspace_id:
        return []
        
    result = await db.execute(
        select(ApiKey).where(ApiKey.workspace_id == current_user.workspace_id)
    )
    keys = result.scalars().all()
    
    return [
        ApiKeySchema(
            id=key.id,
            name=key.name,
            key=f"{key.key_prefix}...{key.hashed_key[:6]}",  # Masked for list representation
            status="active" if key.is_active else "revoked",
            environment="live" if "live" in key.key_prefix else "test",
            scopes=["read:messages", "write:messages", "read:fhir"],
            createdAt=key.created_at.isoformat()
        )
        for key in keys
    ]

@router.post("/api-keys", response_model=ApiKeySchema)
async def create_api_key(
    data: ApiKeyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.workspace_id:
        raise HTTPException(
            status_code=400,
            detail="User must belong to a workspace to generate API keys."
        )
        
    raw_key = f"mbx_{data.environment}_{secrets.token_hex(24)}"
    key_prefix = f"mbx_{data.environment}"
    hashed_key = hashlib.sha256(raw_key.encode()).hexdigest()
    
    api_key = ApiKey(
        key_prefix=key_prefix,
        hashed_key=hashed_key,
        name=data.name,
        is_active=True,
        workspace_id=current_user.workspace_id
    )
    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)
    
    return ApiKeySchema(
        id=api_key.id,
        name=api_key.name,
        key=raw_key,  # Send raw key once on creation
        status="active",
        environment=data.environment,
        scopes=data.scopes,
        createdAt=api_key.created_at.isoformat()
    )

@router.delete("/api-keys/{id}")
async def revoke_api_key(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ApiKey).where(ApiKey.id == id))
    key = result.scalars().first()
    
    if not key:
        raise HTTPException(status_code=404, detail="API key not found.")
        
    # Revoke key
    key.is_active = False
    db.add(key)
    await db.commit()
    return {"success": True}

@router.get("/webhooks", response_model=List[WebhookEndpointSchema])
async def get_webhooks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.workspace_id:
        return []
    
    result = await db.execute(select(WebhookEndpoint).where(WebhookEndpoint.workspace_id == current_user.workspace_id))
    hooks = result.scalars().all()
    
    return [
        WebhookEndpointSchema(
            id=h.id,
            url=h.url,
            status=h.status,
            events=h.events_subscribed.split(","),
            description="Webhook endpoint",
            createdAt=h.created_at.isoformat(),
            signingSecret=h.secret
        ) for h in hooks
    ]

@router.post("/webhooks", response_model=WebhookEndpointSchema)
async def create_webhook(
    data: WebhookCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.workspace_id:
        raise HTTPException(status_code=400, detail="Must belong to a workspace.")
        
    secret = secrets.token_hex(32)
    new_hook = WebhookEndpoint(
        url=data.url,
        secret=secret,
        events_subscribed=",".join(data.events),
        status="active",
        workspace_id=current_user.workspace_id
    )
    db.add(new_hook)
    await db.commit()
    await db.refresh(new_hook)
    
    return WebhookEndpointSchema(
        id=new_hook.id,
        url=new_hook.url,
        status=new_hook.status,
        events=data.events,
        description=data.description or "Webhook endpoint",
        createdAt=new_hook.created_at.isoformat(),
        signingSecret=secret
    )

@router.delete("/webhooks/{id}")
async def delete_webhook(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(WebhookEndpoint).where(
        WebhookEndpoint.id == id,
        WebhookEndpoint.workspace_id == current_user.workspace_id
    ))
    hook = result.scalars().first()
    if not hook:
        raise HTTPException(status_code=404, detail="Webhook not found.")
        
    await db.delete(hook)
    await db.commit()
    return {"success": True}

@router.get("/logs", response_model=ApiRequestLogsResponse)
async def get_api_logs(
    current_user: User = Depends(get_current_user)
):
    return ApiRequestLogsResponse(
        data=MOCK_LOGS,
        meta={
            "total": len(MOCK_LOGS),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "requestId": str(uuid.uuid4())
        }
    )

@router.get("/metrics", response_model=List[UsageMetricSchema])
async def get_usage_metrics(current_user: User = Depends(get_current_user)):
    # Simple daily timeseries
    now = datetime.now(timezone.utc)
    return [
        UsageMetricSchema(
            timestamp=now.isoformat(),
            requests=12000,
            errors=2,
            latency=89
        )
    ]

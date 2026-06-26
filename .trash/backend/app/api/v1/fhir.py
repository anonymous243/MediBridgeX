from datetime import datetime, timezone
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, FhirResource

router = APIRouter()

# Schemas
class FhirValidationIssueSchema(BaseModel):
    severity: str
    code: str
    details: str
    location: Optional[str] = None

class FhirAuditLogSchema(BaseModel):
    id: str
    timestamp: str
    action: str
    actor: str
    status: str

class FhirResourceSchema(BaseModel):
    resourceType: str
    id: str
    status: str
    lastUpdated: str
    patientId: Optional[str] = None
    patientName: Optional[str] = None
    mrn: Optional[str] = None
    region: str
    organizationId: Optional[str] = None
    validationScore: int
    validationIssues: List[FhirValidationIssueSchema]
    relationships: List[dict]
    auditLogs: List[FhirAuditLogSchema]
    metadata: dict
    fhir_json: str

class FhirResourcesResponse(BaseModel):
    data: List[FhirResourceSchema]

# Helper to map db model to schema
def map_db_fhir_to_schema(res: FhirResource) -> FhirResourceSchema:
    payload = res.payload or {}
    
    # Extract details
    patient_name = "Unknown Patient"
    mrn_val = res.resource_id
    
    if payload.get("resourceType") == "Patient":
        names = payload.get("name", [])
        if names:
            family = names[0].get("family", "")
            given = " ".join(names[0].get("given", []))
            patient_name = f"{(given + ' ' + family).strip()}"
            
    # Sub-objects
    audit_logs = [
        FhirAuditLogSchema(
            id=f"audit_{res.id[:8]}",
            timestamp=res.updated_at.isoformat(),
            action="CREATE",
            actor="EHR System Ingestion",
            status="SUCCESS"
        )
    ]

    return FhirResourceSchema(
        resourceType=res.resource_type,
        id=res.resource_id,
        status="Validated",
        lastUpdated=res.updated_at.isoformat(),
        patientId=res.resource_id,
        patientName=patient_name,
        mrn=mrn_val,
        region="US-EAST",
        organizationId=None,
        validationScore=100,
        validationIssues=[],
        relationships=[],
        auditLogs=audit_logs,
        metadata={"facility": "Northshore General"},
        fhir_json=json.dumps(payload, indent=2)
    )

# Endpoints
@router.get("/resources", response_model=FhirResourcesResponse)
async def get_fhir_resources(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.core.audit import log_audit_event
    await log_audit_event(db, current_user.id, "READ", "FhirResource", "bulk")
    
    result = await db.execute(
        select(FhirResource)
        .order_by(FhirResource.updated_at.desc())
        .limit(100)
    )
    resources = result.scalars().all()
    
    return FhirResourcesResponse(
        data=[map_db_fhir_to_schema(res) for res in resources]
    )

@router.get("/resources/{id}", response_model=FhirResourceSchema)
async def get_fhir_resource(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.core.audit import log_audit_event
    await log_audit_event(db, current_user.id, "READ", "FhirResource", id)
    
    result = await db.execute(
        select(FhirResource).where(FhirResource.resource_id == id)
    )
    res = result.scalars().first()
    
    if not res:
        raise HTTPException(status_code=404, detail="FHIR Resource not found.")
        
    return map_db_fhir_to_schema(res)

@router.get("/search", response_model=FhirResourcesResponse)
async def search_fhir_resources(
    q: str = Query(""),
    type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.core.audit import log_audit_event
    await log_audit_event(db, current_user.id, "READ", "FhirResource", f"search:{q}")
    
    query = select(FhirResource)
    if type:
        query = query.where(FhirResource.resource_type == type)
    if q:
        query = query.where(FhirResource.resource_id.ilike(f"%{q}%"))
        
    result = await db.execute(query.order_by(FhirResource.updated_at.desc()))
    resources = result.scalars().all()
    
    return FhirResourcesResponse(
        data=[map_db_fhir_to_schema(res) for res in resources]
    )

@router.post("/resources/{id}/sync")
async def sync_fhir_resource(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(FhirResource).where(FhirResource.resource_id == id)
    )
    res = result.scalars().first()
    if not res:
        raise HTTPException(status_code=404, detail="FHIR Resource not found.")
        
    # Just update the timestamp to simulate a sync
    res.updated_at = datetime.now(timezone.utc)
    db.add(res)
    await db.commit()
    return {"success": True}

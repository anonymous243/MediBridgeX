from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, Workspace

router = APIRouter()

# Schema for onboarding request
class OnboardingSubmit(BaseModel):
    organization: dict
    infrastructure: list
    infraPreferences: dict
    compliance: dict
    team: list

@router.post("/submit")
async def submit_onboarding(
    data: OnboardingSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    org_name = data.organization.get("name", "New Hospital")
    org_slug = data.organization.get("slug") or org_name.lower().replace(" ", "-")

    # Create workspace
    workspace = Workspace(
        name=org_name,
        onboarded=True,
    )
    db.add(workspace)
    await db.flush()  # Populate workspace.id

    # Update user association and role
    current_user.workspace_id = workspace.id
    current_user.role = "admin"
    db.add(current_user)

    await db.commit()

    return {
        "success": True,
        "workspaceId": workspace.id
    }

@router.get("/status")
async def get_onboarding_status(
    current_user: User = Depends(get_current_user)
):
    # If the user has an assigned workspace, onboarding is complete
    onboarded = current_user.workspace_id is not None
    return {
        "onboarded": onboarded,
        "workspaceId": current_user.workspace_id
    }

@router.get("/validate-slug")
async def validate_slug(
    slug: str = Query(..., min_length=3),
    db: AsyncSession = Depends(get_db)
):
    reserved = ["admin", "api", "auth", "dashboard", "settings", "fhir", "messages"]
    if slug.lower() in reserved:
        return False

    result = await db.execute(
        select(Workspace).where(Workspace.name.ilike(slug))
    )
    exists = result.scalars().first()
    return exists is None

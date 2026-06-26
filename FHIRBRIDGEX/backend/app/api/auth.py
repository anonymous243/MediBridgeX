from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.organization import Organization
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    fullName: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class WorkspaceRequest(BaseModel):
    userId: str
    organizationName: str
    workspaceSlug: str

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.scalars(select(User).filter_by(email=req.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=req.email,
        full_name=req.fullName,
        hashed_password=get_password_hash(req.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "userId": new_user.id,
        "email": new_user.email,
        "message": "Signup successful. Please verify OTP or proceed to workspace setup."
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalars(select(User).filter_by(email=req.email)).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.id, "email": user.email, "org": user.organization_id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "fullName": user.full_name,
            "organizationId": user.organization_id,
            "role": user.role
        }
    }

@router.post("/workspace")
def create_workspace(req: WorkspaceRequest, db: Session = Depends(get_db)):
    user = db.scalars(select(User).filter_by(id=req.userId)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    existing_org = db.scalars(select(Organization).filter_by(slug=req.workspaceSlug)).first()
    if existing_org:
        raise HTTPException(status_code=400, detail="Workspace slug already taken")
        
    new_org = Organization(
        name=req.organizationName,
        slug=req.workspaceSlug
    )
    db.add(new_org)
    db.flush() # get new_org.id
    
    user.organization_id = new_org.id
    db.commit()
    
    access_token = create_access_token(data={"sub": user.id, "email": user.email, "org": user.organization_id})
    
    return {
        "message": "Workspace created successfully",
        "access_token": access_token,
        "organization": {
            "id": new_org.id,
            "name": new_org.name,
            "slug": new_org.slug
        }
    }

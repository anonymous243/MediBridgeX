from datetime import datetime, timezone, timedelta
import secrets
import logging
import os
import asyncio
import resend
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user
from app.models.all_models import User, Workspace, OTPVerification

router = APIRouter()
logger = logging.getLogger("medibridgex.auth")

# Permission dictionary mapped by role
ROLE_PERMISSIONS = {
    "admin": [
        "manage:users", "view:analytics", "manage:settings", 
        "view:observability", "view:messages", "view:fhir",
        "manage:api_keys", "manage:webhooks", "view:audit_logs", 
        "access:developer_tools"
    ],
    "operator": ["view:messages", "retry:messages", "view:observability"],
    "developer": [
        "manage:api_keys", "manage:webhooks", "access:developer_tools", 
        "view:fhir", "view:observability"
    ],
    "auditor": ["view:audit_logs", "view:analytics", "view:observability"],
    "super_admin": [
        "manage:organizations", "manage:users", "view:analytics", "manage:api_keys", 
        "retry:messages", "view:audit_logs", "access:developer_tools", 
        "view:observability", "manage:settings", "manage:webhooks", "view:messages", "view:fhir"
    ],
}

# Request/Response Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    fullName: str

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

class WorkspaceDetail(BaseModel):
    slug: str
    region: str
    organizationType: str
    hospitalSize: str
    fhirVersion: str
    provisionedAt: str

class UserSessionResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    organizationId: Optional[str] = None
    organizationName: Optional[str] = None
    permissions: List[str]
    onboardingCompleted: bool
    workspaceSlug: Optional[str] = None
    workspace: Optional[WorkspaceDetail] = None

class LoginResponse(BaseModel):
    user: UserSessionResponse
    token: str

class OnboardingSubmitRequest(BaseModel):
    organization: dict
    infrastructure: List[dict]
    infraPreferences: dict
    compliance: dict
    team: List[dict]

# Helper function to generate and save OTP
async def send_otp_email(email: str, db: AsyncSession) -> str:
    # Generate cryptographically secure 6-digit OTP code (value between 100000 and 999999)
    otp_code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    # Store OTP in DB
    otp_record = OTPVerification(
        email=email,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(otp_record)
    await db.commit()
    # Check for Resend API Key
    resend.api_key = os.getenv("RESEND_API_KEY")
    email_sent = False

    if resend.api_key:
        try:
            params: resend.Emails.SendParams = {
                "from": "MediBridgeX <security@medibridgex.com>",
                "to": [email],
                "subject": "Your MediBridgeX Verification Code",
                "html": f"<strong>Your verification code is: {otp_code}</strong><br><br>It expires in 10 minutes.",
            }
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"📧 [OTP DELIVERY] Sent email via Resend to {email}")
            email_sent = True
        except Exception as e:
            logger.error(f"Failed to send email via Resend: {e}")

    # Fallback to local log file if Resend is not configured or failed
    if not email_sent:
        logger.info(f"🔑 [OTP DELIVERY] Generated OTP {otp_code} for user {email} (expires in 10 minutes)")
        print(f"\n🔑 [OTP DELIVERY] Generated OTP {otp_code} for user {email} (expires in 10 minutes)\n", flush=True)
        try:
            log_path = "/home/amar/Desktop/MediBridgeX/otp_deliveries.log"
            with open(log_path, "a") as f:
                f.write(f"[{datetime.now(timezone.utc).isoformat()}] Email: {email} | OTP: {otp_code}\n")
        except Exception as e:
            logger.error(f"Failed to write OTP to file: {e}")
            
    return otp_code

# Endpoints
@router.post("/signup")
async def signup(data: SignupRequest, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    
    if user:
        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address already registered."
            )
        else:
            # User exists but is not verified, resend OTP
            await send_otp_email(data.email, db)
            return {"message": "Email is already registered but unverified. A new OTP has been sent."}

    # Create unverified user
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role="admin",  # Default to admin for the first onboarding user
        is_verified=False
    )
    db.add(user)
    await db.commit()
    
    # Generate and send OTP
    await send_otp_email(data.email, db)
    return {"message": "Account created. Please verify your email with the OTP code sent."}

@router.post("/verify-otp", response_model=LoginResponse)
async def verify_otp(data: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    # Find matching active OTP
    now = datetime.now(timezone.utc)
    otp_result = await db.execute(
        select(OTPVerification)
        .where(
            OTPVerification.email == data.email,
            OTPVerification.otp_code == data.otp_code,
            OTPVerification.expires_at > now
        )
    )
    otp_record = otp_result.scalars().first()
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP code."
        )

    # Verify user and clear OTP
    user.is_verified = True
    db.add(user)
    await db.delete(otp_record)
    await db.commit()
    await db.refresh(user)

    # Build response session
    workspace = None
    if user.workspace_id:
        workspace_result = await db.execute(select(Workspace).where(Workspace.id == user.workspace_id))
        workspace = workspace_result.scalars().first()

    onboarding_completed = workspace is not None
    workspace_details = None
    if workspace:
        workspace_details = WorkspaceDetail(
            slug=workspace.name.lower().replace(" ", "-"),
            region="US East (N. Virginia)",
            organizationType="Hospital Network",
            hospitalSize="Large (500–2000 beds)",
            fhirVersion="FHIR R4",
            provisionedAt=workspace.created_at.isoformat()
        )

    user_response = UserSessionResponse(
        id=user.id,
        email=user.email,
        name=user.email.split("@")[0].capitalize(),
        role=user.role,
        organizationId=workspace.id if workspace else None,
        organizationName=workspace.name if workspace else None,
        permissions=ROLE_PERMISSIONS.get(user.role, ["view:observability"]),
        onboardingCompleted=onboarding_completed,
        workspaceSlug=workspace.name.lower().replace(" ", "-") if workspace else None,
        workspace=workspace_details
    )

    # Issue JWT token
    token = create_access_token(subject=user.id)
    return LoginResponse(user=user_response, token=token)

@router.post("/resend-otp")
async def resend_otp(data: ResendOTPRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified."
        )

    await send_otp_email(data.email, db)
    return {"message": "A new OTP code has been sent."}

@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()

    # If user doesn't exist, we register them for developer experience (automatic registration)
    if not user:
        # Create a workspace-less user (needs onboarding)
        user = User(
            email=data.email,
            hashed_password=get_password_hash(data.password),
            role="admin",  # Default to admin for the first onboarding user
            is_verified=True,  # Automatically verified if auto-registered via login
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        # Verify password
        if not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
        # Check if user is verified
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="UNVERIFIED_EMAIL"
            )

    # Fetch associated workspace if any
    workspace = None
    if user.workspace_id:
        workspace_result = await db.execute(select(Workspace).where(Workspace.id == user.workspace_id))
        workspace = workspace_result.scalars().first()

    # Build response session
    onboarding_completed = workspace is not None
    workspace_details = None
    if workspace:
        workspace_details = WorkspaceDetail(
            slug=workspace.name.lower().replace(" ", "-"),
            region="US East (N. Virginia)",
            organizationType="Hospital Network",
            hospitalSize="Large (500–2000 beds)",
            fhirVersion="FHIR R4",
            provisionedAt=workspace.created_at.isoformat()
        )

    user_response = UserSessionResponse(
        id=user.id,
        email=user.email,
        name=user.email.split("@")[0].capitalize(),
        role=user.role,
        organizationId=workspace.id if workspace else None,
        organizationName=workspace.name if workspace else None,
        permissions=ROLE_PERMISSIONS.get(user.role, ["view:observability"]),
        onboardingCompleted=onboarding_completed,
        workspaceSlug=workspace.name.lower().replace(" ", "-") if workspace else None,
        workspace=workspace_details
    )

    # Issue JWT token
    token = create_access_token(subject=user.id)

    return LoginResponse(user=user_response, token=token)

@router.get("/me", response_model=UserSessionResponse)
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    workspace = None
    if current_user.workspace_id:
        workspace_result = await db.execute(select(Workspace).where(Workspace.id == current_user.workspace_id))
        workspace = workspace_result.scalars().first()

    onboarding_completed = workspace is not None
    workspace_details = None
    if workspace:
        workspace_details = WorkspaceDetail(
            slug=workspace.name.lower().replace(" ", "-"),
            region="US East (N. Virginia)",
            organizationType="Hospital Network",
            hospitalSize="Large (500–2000 beds)",
            fhirVersion="FHIR R4",
            provisionedAt=workspace.created_at.isoformat()
        )

    return UserSessionResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.email.split("@")[0].capitalize(),
        role=current_user.role,
        organizationId=workspace.id if workspace else None,
        organizationName=workspace.name if workspace else None,
        permissions=ROLE_PERMISSIONS.get(current_user.role, ["view:observability"]),
        onboardingCompleted=onboarding_completed,
        workspaceSlug=workspace.name.lower().replace(" ", "-") if workspace else None,
        workspace=workspace_details
    )

import uuid
from datetime import datetime, timezone
import json
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.core.security import encrypt_payload, decrypt_payload

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    onboarded = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    users = relationship("User", back_populates="workspace", cascade="all, delete-orphan")
    api_keys = relationship("ApiKey", back_populates="workspace", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="developer")  # developer, admin, compliance_officer
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=True)

    workspace = relationship("Workspace", back_populates="users")

class PipelineMessage(Base):
    __tablename__ = "pipeline_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    direction = Column(String, default="inbound")  # inbound, outbound
    source = Column(String, nullable=False)  # e.g., Epic EHR, LabCorp
    destination = Column(String, nullable=False)  # e.g., MediBridgeX FHIR Repository
    status = Column(String, default="processing")  # success, failed, processing
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Encrypted fields
    _hl7_payload = Column("hl7_payload", Text, nullable=True)
    _fhir_payload = Column("fhir_payload", Text, nullable=True)

    @property
    def hl7_payload(self) -> str:
        return decrypt_payload(self._hl7_payload)

    @hl7_payload.setter
    def hl7_payload(self, value: str):
        self._hl7_payload = encrypt_payload(value)

    @property
    def fhir_payload(self) -> dict:
        decrypted = decrypt_payload(self._fhir_payload)
        if not decrypted:
            return {}
        try:
            return json.loads(decrypted)
        except Exception:
            return {"error": "Failed to parse decrypted FHIR JSON payload."}

    @fhir_payload.setter
    def fhir_payload(self, value: dict):
        self._fhir_payload = encrypt_payload(json.dumps(value))

class FhirResource(Base):
    __tablename__ = "fhir_resources"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resource_type = Column(String, index=True, nullable=False)  # e.g., Patient, Observation
    resource_id = Column(String, index=True, nullable=False)  # logical FHIR ID
    version = Column(Integer, default=1)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Encrypted FHIR JSON representation
    _payload = Column("payload", Text, nullable=False)

    @property
    def payload(self) -> dict:
        decrypted = decrypt_payload(self._payload)
        if not decrypted:
            return {}
        try:
            return json.loads(decrypted)
        except Exception:
            return {"error": "Failed to parse decrypted FHIR payload."}

    @payload.setter
    def payload(self, value: dict):
        self._payload = encrypt_payload(json.dumps(value))

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key_prefix = Column(String, nullable=False)  # e.g., mbx_live_...
    hashed_key = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)  # client / project name
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)

    workspace = relationship("Workspace", back_populates="api_keys")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String, nullable=False)  # READ, WRITE, EXPORT, DELETE
    resource_type = Column(String, nullable=False)  # Patient, PipelineMessage, etc.
    resource_id = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Cryptographic signature over the log entry to ensure it is tamper-proof
    signature = Column(String, nullable=False)

    user = relationship("User")

class WebhookEndpoint(Base):
    __tablename__ = "webhook_endpoints"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    url = Column(String, nullable=False)
    secret = Column(String, nullable=False)
    events_subscribed = Column(String, nullable=False) # e.g. "fhir.created"
    status = Column(String, default="active") # active, failing, disabled
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)

    workspace = relationship("Workspace", backref="webhook_endpoints")

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, index=True, nullable=False)
    otp_code = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)

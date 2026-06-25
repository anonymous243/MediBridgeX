from datetime import datetime, timedelta, timezone
from typing import Any, Union
from cryptography.fernet import Fernet
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Setup password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Setup field encryption
try:
    fernet = Fernet(settings.ENCRYPTION_KEY.encode())
except Exception:
    # Generate fallback key in case the config key is invalid (development only)
    fallback_key = Fernet.generate_key()
    fernet = Fernet(fallback_key)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Cryptographic functions for database fields
def encrypt_payload(plaintext: str) -> str:
    """Encrypts a plaintext string (e.g. raw HL7 or FHIR JSON)."""
    if not plaintext:
        return ""
    encrypted_bytes = fernet.encrypt(plaintext.encode())
    return encrypted_bytes.decode()

def decrypt_payload(ciphertext: str) -> str:
    """Decrypts a ciphertext string back to its original plaintext."""
    if not ciphertext:
        return ""
    try:
        decrypted_bytes = fernet.decrypt(ciphertext.encode())
        return decrypted_bytes.decode()
    except Exception:
        # Return empty or error message if decryption fails (e.g. key mismatch)
        return "[DECRYPTION_ERROR] Failed to decrypt secure payload."

import hmac
import hashlib

def sign_audit_log(user_id: str, action: str, resource_type: str, resource_id: str, timestamp_iso: str) -> str:
    """Generates an HMAC SHA-256 signature for an audit log entry using the system JWT_SECRET."""
    msg = f"{user_id}:{action}:{resource_type}:{resource_id}:{timestamp_iso}"
    return hmac.new(settings.JWT_SECRET.encode(), msg.encode(), hashlib.sha256).hexdigest()

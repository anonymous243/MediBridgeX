"""
MediBridgeX — Settings & Secrets
=================================
All secrets are loaded from the .env file (never hardcoded).
In production, missing or weak secrets cause an immediate startup failure.
This is intentional — a misconfigured server is safer than a running one
with default credentials.

To rotate secrets:
  - ENCRYPTION_KEY: generate new Fernet key, re-encrypt DB rows, swap key
  - JWT_SECRET: change value — all existing tokens invalidate immediately
"""

import sys
from typing import List
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Sentinel prefixes that flag unset/placeholder secrets
_PLACEHOLDER_PREFIXES = ("REPLACE_WITH", "changeme", "secret", "example")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────────────
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"  # development | production

    # ── Cryptographic secrets ─────────────────────────────────────────────────
    # These have NO safe defaults. The app will refuse to start in production
    # without them. In development they fall back to a generated key at startup.
    ENCRYPTION_KEY: str = ""   # Fernet AES-256 key — loaded from .env
    JWT_SECRET: str = ""       # 512-bit random hex — loaded from .env

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # ── Database ─────────────────────────────────────────────────────────────
    # Dev default: SQLite (zero setup). Override in .env for production.
    DATABASE_URL: str = "sqlite+aiosqlite:///./medibridgex.db"

    # ── Network ──────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    # Plain string from .env: "http://localhost:3000,https://app.medibridgex.io"
    # Access as list via settings.cors_origins_list
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        """Returns CORS origins as a list, split on commas."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @model_validator(mode="after")
    def validate_secrets(self) -> "Settings":
        """
        Validates that real secrets are provided.
        - In production: missing secrets crash the process immediately.
        - In development: missing secrets are auto-generated with a warning
          so new contributors can run the server without setup friction.
        """
        from cryptography.fernet import Fernet
        import secrets as _secrets
        import logging

        log = logging.getLogger("medibridgex.config")

        # ── ENCRYPTION_KEY ──────────────────────────────────────────────────
        key_missing = (
            not self.ENCRYPTION_KEY
            or any(self.ENCRYPTION_KEY.startswith(p) for p in _PLACEHOLDER_PREFIXES)
        )
        if key_missing:
            if self.ENVIRONMENT == "production":
                sys.exit(
                    "FATAL: ENCRYPTION_KEY is not set. "
                    "Set it in .env before starting in production. "
                    "Generate with: python3 -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
                )
            # Dev-only fallback: generate an ephemeral key with a loud warning.
            # Data encrypted with this key is lost on restart — acceptable in dev.
            self.ENCRYPTION_KEY = Fernet.generate_key().decode()
            log.warning(
                "⚠️  ENCRYPTION_KEY not set — using ephemeral dev key. "
                "Set ENCRYPTION_KEY in backend/.env to persist encrypted data."
            )

        # Validate the key is a parseable Fernet key regardless of source
        try:
            Fernet(self.ENCRYPTION_KEY.encode())
        except Exception:
            sys.exit(
                "FATAL: ENCRYPTION_KEY is not a valid Fernet key. "
                "Generate a new one with: python3 -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
            )

        # ── JWT_SECRET ───────────────────────────────────────────────────────
        secret_missing = (
            not self.JWT_SECRET
            or any(self.JWT_SECRET.startswith(p) for p in _PLACEHOLDER_PREFIXES)
            or len(self.JWT_SECRET) < 32   # minimum 256-bit key
        )
        if secret_missing:
            if self.ENVIRONMENT == "production":
                sys.exit(
                    "FATAL: JWT_SECRET is not set or too short (minimum 32 chars). "
                    "Set it in .env before starting in production. "
                    "Generate with: python3 -c \"import secrets; print(secrets.token_hex(64))\""
                )
            self.JWT_SECRET = _secrets.token_hex(64)
            log.warning(
                "⚠️  JWT_SECRET not set — using ephemeral dev secret. "
                "All tokens will be invalidated on restart. "
                "Set JWT_SECRET in backend/.env."
            )

        return self


# Single global instance — import this everywhere
settings = Settings()

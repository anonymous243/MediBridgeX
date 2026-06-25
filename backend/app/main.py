"""
MediBridgeX FastAPI Backend — main.py
======================================
Entrypoint for the API server. Handles:
- CORS with strict origin allowlist
- Security headers on every response
- Structured global exception handling
- Router registration under /api/v1
- Auto-creation of all DB tables on startup (no Alembic needed for dev)
"""

import time
import uuid
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine
from app.models.all_models import Workspace, User, PipelineMessage, FhirResource, ApiKey, AuditLog  # noqa: F401
from app.core.database import Base

from app.api.v1 import auth, messages, fhir, developers, settings as settings_router, onboarding

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("medibridgex")

# ── Lifespan (startup / shutdown) ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    On startup:
    Database migrations are now managed by Alembic. 
    Ensure you have run `alembic upgrade head` before starting the application.
    """
    logger.info("🔐 MediBridgeX starting...")
    logger.info("✅ Database ready.")
    yield
    logger.info("🛑 MediBridgeX shutting down.")

from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter, _rate_limit_exceeded_handler

# ── FastAPI App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="MediBridgeX API",
    description="HIPAA-compliant healthcare interoperability platform API.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── Rate Limiting ──────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ── CORS — strict allowlist ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,  # e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    max_age=600,
)

# ── Security Headers Middleware ────────────────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """
    Adds OWASP-recommended security headers to every response.
    Prevents XSS, clickjacking, MIME sniffing, and information leakage.
    Also injects a unique request ID for distributed tracing.
    """
    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()

    response = await call_next(request)

    duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time-Ms"] = str(duration_ms)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    # Remove server fingerprinting — MutableHeaders uses del, not pop
    if "server" in response.headers:
        del response.headers["server"]
    return response

# ── Global Exception Handlers ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Catches any unhandled exception and returns a clean JSON error.
    Never leaks internal stack traces to clients.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )

from app.api.v1 import auth, onboarding, messages, fhir, developers, settings as settings_router

# ── Router Registration ────────────────────────────────────────────────────────
API = settings.API_V1_STR  # /api/v1

app.include_router(auth.router,        prefix=f"{API}/auth",        tags=["Auth"])
app.include_router(onboarding.router,  prefix=f"{API}/onboarding",  tags=["Onboarding"])
app.include_router(messages.router,    prefix=f"{API}/messages",     tags=["Messages"])
app.include_router(fhir.router,        prefix=f"{API}/fhir",         tags=["FHIR"])
app.include_router(developers.router,  prefix=f"{API}/developers",   tags=["Developers"])
app.include_router(settings_router.router, prefix=f"{API}/settings", tags=["Settings"])

# ── Health Check ───────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    """Kubernetes/Docker liveness probe endpoint."""
    return {"status": "ok", "service": "medibridgex-api", "version": "1.0.0"}

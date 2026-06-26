from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import dashboard, fhir_lookup, fhir_submit, health, hl7, patients
from app.core.config import settings
from app.core.database import init_db
from app.models import hl7_record, patient_record


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://medibridgex.com",
        "https://www.medibridgex.com",
        "https://medibridgex.pages.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(dashboard.router)
app.include_router(fhir_lookup.router)
app.include_router(fhir_submit.router)
app.include_router(hl7.router, tags=["HL7"])
app.include_router(patients.router, prefix="/api", tags=["Patients"])

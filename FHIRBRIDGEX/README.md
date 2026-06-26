# FHIRBridge

FHIRBridge is a FastAPI-based healthcare interoperability MVP.

## Services

- `backend`: FastAPI API for health checks and FHIR message ingestion.
- `worker`: Background processor for queued FHIR messages.
- `frontend`: Static placeholder for the future UI.
- `redis`: Queue backend for MVP async processing.

## Quick Start

```bash
docker compose up --build
```

Then open:

- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs
- Frontend placeholder: http://localhost:8080

## MVP Flow

1. Send a FHIR payload to `POST /fhir/messages`.
2. The backend queues the payload in Redis.
3. The worker reads queued payloads and processes them.


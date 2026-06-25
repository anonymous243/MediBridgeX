import pytest
from app.models.all_models import PipelineMessage
from sqlalchemy.future import select

@pytest.mark.asyncio
async def test_ingest_valid_hl7(async_client):
    payload = {
        "hl7_message": "MSH|^~\\&|EPIC|NORTHSHORE|MBX|MEDIBRIDGEX|20240516||ADT^A01|12345|P|2.5\rPID|1||MRN-00123^^^NORTHSHORE^MR||SMITH^JOHN^A||19800101|M",
        "source": "Test"
    }
    response = await async_client.post("/api/v1/messages/ingest", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "message_id" in data

@pytest.mark.asyncio
async def test_get_message_stream_audit_logging(async_client):
    # This endpoint is authenticated, but get_current_user is mocked in conftest
    response = await async_client.get("/api/v1/messages/stream")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data

    # Verify audit log was created
    from tests.conftest import TestingSessionLocal
    from app.models.all_models import AuditLog
    async with TestingSessionLocal() as session:
        result = await session.execute(select(AuditLog))
        logs = result.scalars().all()
        # Since this runs after other tests or independently, we just check there is at least one READ log
        assert any(log.action == "READ" and log.resource_type == "PipelineMessageStream" for log in logs)

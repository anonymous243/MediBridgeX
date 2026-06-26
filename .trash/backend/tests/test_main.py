import pytest

@pytest.mark.asyncio
async def test_health_check(async_client):
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "medibridgex-api", "version": "1.0.0"}

@pytest.mark.asyncio
async def test_security_headers_present(async_client):
    response = await async_client.get("/health")
    assert "x-request-id" in response.headers
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["x-content-type-options"] == "nosniff"

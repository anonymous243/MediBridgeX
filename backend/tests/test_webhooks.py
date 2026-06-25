import pytest
from unittest.mock import patch, AsyncMock
from app.core.webhooks import dispatch_webhook
from app.models.all_models import WebhookEndpoint
from tests.conftest import TestingSessionLocal
import json

@pytest.mark.asyncio
async def test_dispatch_webhook():
    async with TestingSessionLocal() as session:
        # 1. Create a dummy webhook endpoint
        endpoint = WebhookEndpoint(
            url="https://dummy.hospital.com/webhook",
            secret="supersecret",
            events_subscribed="fhir.created",
            workspace_id="test_ws_1"
        )
        session.add(endpoint)
        await session.commit()

        # 2. Mock httpx.AsyncClient.post
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.return_value.is_success = True
            mock_post.return_value.status_code = 200

            payload = {"resourceType": "Patient", "id": "123"}
            
            # 3. Trigger dispatch
            await dispatch_webhook(session, "fhir.created", payload, "test_ws_1")

            # 4. Verify httpx was called correctly with signature
            mock_post.assert_called_once()
            args, kwargs = mock_post.call_args
            assert args[0] == "https://dummy.hospital.com/webhook"
            assert kwargs["content"] == json.dumps(payload).encode('utf-8')
            assert "X-MediBridgeX-Signature" in kwargs["headers"]
            assert "sha256=" in kwargs["headers"]["X-MediBridgeX-Signature"]

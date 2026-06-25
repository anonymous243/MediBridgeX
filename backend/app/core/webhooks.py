import hmac
import hashlib
import json
import logging
import httpx
from datetime import datetime, timezone
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.all_models import WebhookEndpoint

logger = logging.getLogger(__name__)

async def dispatch_webhook(db: AsyncSession, event_type: str, payload: dict, workspace_id: str):
    """
    Finds all active webhooks subscribed to the event_type in the given workspace
    and dispatches the payload to them securely.
    """
    logger.info(f"Dispatching webhook event '{event_type}' for workspace {workspace_id}...")

    # Fetch active webhooks
    query = select(WebhookEndpoint).where(
        WebhookEndpoint.workspace_id == workspace_id,
        WebhookEndpoint.status == "active",
        WebhookEndpoint.events_subscribed.like(f"%{event_type}%")
    )
    result = await db.execute(query)
    endpoints = result.scalars().all()

    if not endpoints:
        logger.info("No active webhooks found for this event.")
        return

    # Serialize payload once
    payload_bytes = json.dumps(payload).encode('utf-8')

    async with httpx.AsyncClient(timeout=10.0) as client:
        for endpoint in endpoints:
            try:
                # 1. Cryptographic Signature
                signature = hmac.new(
                    endpoint.secret.encode('utf-8'),
                    payload_bytes,
                    hashlib.sha256
                ).hexdigest()

                headers = {
                    "Content-Type": "application/json",
                    "X-MediBridgeX-Event": event_type,
                    "X-MediBridgeX-Signature": f"sha256={signature}",
                    "User-Agent": "MediBridgeX-Webhook/1.0"
                }

                # 2. Fire Request
                logger.info(f"Sending webhook to {endpoint.url}...")
                response = await client.post(endpoint.url, content=payload_bytes, headers=headers)
                
                # 3. Log Success/Failure
                if response.is_success:
                    logger.info(f"Webhook delivered to {endpoint.url} (Status: {response.status_code})")
                else:
                    logger.warning(f"Webhook failed to {endpoint.url} (Status: {response.status_code})")
                    # Here we could implement retry logic or mark endpoint as failing

            except httpx.RequestError as e:
                logger.error(f"Webhook request error for {endpoint.url}: {e}")
            except Exception as e:
                logger.error(f"Unexpected error dispatching webhook to {endpoint.url}: {e}")

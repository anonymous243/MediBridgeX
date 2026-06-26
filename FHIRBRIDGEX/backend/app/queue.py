import json
from typing import Any
from uuid import uuid4

from redis import Redis

from app.core.config import settings


redis_client = Redis.from_url(settings.redis_url, decode_responses=True)


def enqueue_fhir_message(payload: dict[str, Any]) -> str:
    message_id = str(uuid4())
    message = {"id": message_id, "payload": payload}
    redis_client.rpush(settings.fhir_queue_name, json.dumps(message))
    return message_id


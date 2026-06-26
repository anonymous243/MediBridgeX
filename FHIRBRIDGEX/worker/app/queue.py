import json
from typing import Any

import pika

from app.config import settings


def get_connection() -> pika.BlockingConnection:
    parameters = pika.URLParameters(settings.rabbitmq_url)
    return pika.BlockingConnection(parameters)


def consume_hl7_messages(callback) -> None:
    connection = get_connection()
    channel = connection.channel()
    channel.queue_declare(queue=settings.hl7_queue_name, durable=True)
    channel.basic_qos(prefetch_count=1)

    def handle_message(channel, method, properties, body: bytes) -> None:
        message: dict[str, Any] = json.loads(body.decode("utf-8"))
        callback(message)
        channel.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue=settings.hl7_queue_name, on_message_callback=handle_message)
    channel.start_consuming()

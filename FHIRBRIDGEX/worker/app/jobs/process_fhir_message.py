from typing import Any


def process_fhir_message(message: dict[str, Any]) -> None:
    message_id = message.get("id", "unknown")
    resource_type = message.get("payload", {}).get("resourceType", "unknown")
    print(f"Processed FHIR message {message_id} ({resource_type})")


from datetime import datetime, timezone
import re
from typing import Any
from urllib.parse import quote, urlparse

import httpx

from app.config import settings


HL7_GENDER_MAP = {
    "M": "male",
    "F": "female",
    "O": "other",
    "U": "unknown",
    "A": "other",
    "N": "unknown",
}

ADT_ENCOUNTER_STATUS = {
    "A01": "in-progress",
    "A02": "in-progress",
    "A03": "finished",
    "A04": "in-progress",
    "A05": "planned",
    "A08": "in-progress",
    "A11": "cancelled",
    "A13": "in-progress",
}
FHIR_HEADERS = {
    "Accept": "application/fhir+json, application/json",
    "Content-Type": "application/fhir+json",
}
DUPLICATE_RESOURCE_PATTERN = re.compile(
    r"Can not create resource duplicating existing resource: ([A-Za-z]+)/([A-Za-z0-9\-._~]+)"
)


def split_components(value: str) -> list[str]:
    return value.split("^") if value else []


def hl7_date_to_fhir(value: str) -> str | None:
    if len(value) < 8 or not value[:8].isdigit():
        return None

    return f"{value[0:4]}-{value[4:6]}-{value[6:8]}"


def parse_hl7_message(hl7_message: str) -> dict[str, list[list[str]]]:
    segments: dict[str, list[list[str]]] = {}
    for raw_segment in hl7_message.replace("\r", "\n").splitlines():
        segment = raw_segment.strip()
        if not segment:
            continue

        fields = segment.split("|")
        segments.setdefault(fields[0], []).append(fields)

    return segments


def parse_message_type(segments: dict[str, list[list[str]]]) -> tuple[str, str]:
    msh = segments.get("MSH", [[]])[0]
    message_type = msh[8] if len(msh) > 8 else "ADT"
    components = split_components(message_type)
    trigger_event = components[1] if len(components) > 1 else "unknown"
    return message_type, trigger_event


def build_patient_identifier(raw_identifier: str, fallback_id: str) -> tuple[str, list[dict[str, Any]]]:
    identifiers = []
    patient_id = fallback_id

    for repetition in raw_identifier.split("~"):
        parts = split_components(repetition)
        value = parts[0] if parts else ""
        if not value:
            continue

        if patient_id == fallback_id:
            patient_id = value

        identifier: dict[str, Any] = {"use": "usual", "value": value}
        if len(parts) > 3 and parts[3]:
            identifier["assigner"] = {"display": parts[3]}
        if len(parts) > 4 and parts[4]:
            identifier["type"] = {"text": parts[4]}
        identifiers.append(identifier)

    return patient_id, identifiers


def build_human_name(raw_name: str) -> list[dict[str, Any]]:
    names = []
    for repetition in raw_name.split("~"):
        parts = split_components(repetition)
        family = parts[0] if len(parts) > 0 and parts[0] else "Unknown"
        given = [part for part in parts[1:3] if part]
        names.append(
            {
                "use": "official",
                "family": family,
                "given": given or ["Unknown"],
                "text": " ".join([*(given or ["Unknown"]), family]).strip(),
            }
        )

    return names or [{"use": "official", "family": "Unknown", "given": ["Unknown"], "text": "Unknown"}]


def build_address(raw_address: str) -> list[dict[str, Any]]:
    if not raw_address:
        return []

    addresses = []
    for repetition in raw_address.split("~"):
        parts = split_components(repetition)
        line = [part for part in parts[0:2] if part]
        address: dict[str, Any] = {"use": "home"}
        if line:
            address["line"] = line
        if len(parts) > 2 and parts[2]:
            address["city"] = parts[2]
        if len(parts) > 3 and parts[3]:
            address["state"] = parts[3]
        if len(parts) > 4 and parts[4]:
            address["postalCode"] = parts[4]
        if len(parts) > 5 and parts[5]:
            address["country"] = parts[5]
        addresses.append(address)

    return addresses


def build_telecom(*values: tuple[str, str]) -> list[dict[str, str]]:
    telecom = []
    for value, use in values:
        if value:
            telecom.append({"system": "phone", "value": value, "use": use})
    return telecom


def convert_hl7_to_fhir_patient(message_id: str, hl7_message: str) -> dict[str, Any]:
    return convert_hl7_adt_to_fhir_bundle(message_id, hl7_message)


def convert_hl7_adt_to_fhir_bundle(message_id: str, hl7_message: str) -> dict[str, Any]:
    segments = parse_hl7_message(hl7_message)
    message_type, trigger_event = parse_message_type(segments)
    pid = segments.get("PID", [[]])[0]
    pv1 = segments.get("PV1", [[]])[0]

    patient_id, identifiers = build_patient_identifier(pid[3] if len(pid) > 3 else "", message_id)
    patient: dict[str, Any] = {
        "resourceType": "Patient",
        "id": patient_id,
        "active": trigger_event not in {"A23", "A29"},
        "identifier": identifiers or [{"use": "usual", "value": patient_id}],
        "name": build_human_name(pid[5] if len(pid) > 5 else ""),
        "gender": HL7_GENDER_MAP.get((pid[8] if len(pid) > 8 else "").upper(), "unknown"),
    }

    birth_date = hl7_date_to_fhir(pid[7] if len(pid) > 7 else "")
    if birth_date:
        patient["birthDate"] = birth_date

    addresses = build_address(pid[11] if len(pid) > 11 else "")
    if addresses:
        patient["address"] = addresses

    telecom = build_telecom(
        (pid[13] if len(pid) > 13 else "", "home"),
        (pid[14] if len(pid) > 14 else "", "work"),
    )
    if telecom:
        patient["telecom"] = telecom

    bundle: dict[str, Any] = {
        "resourceType": "Bundle",
        "id": message_id,
        "type": "message",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "entry": [
            {
                "fullUrl": f"urn:uuid:message-header-{message_id}",
                "resource": {
                    "resourceType": "MessageHeader",
                    "id": f"message-header-{message_id}",
                    "eventCoding": {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0003",
                        "code": trigger_event,
                        "display": message_type,
                    },
                    "source": {"name": "FHIRBridge"},
                    "focus": [{"reference": f"Patient/{patient_id}"}],
                },
            },
            {
                "fullUrl": f"urn:uuid:patient-{patient_id}",
                "resource": patient,
            },
        ],
    }

    if pv1:
        encounter_id = f"{patient_id}-{trigger_event.lower()}"
        encounter = {
            "resourceType": "Encounter",
            "id": encounter_id,
            "status": ADT_ENCOUNTER_STATUS.get(trigger_event, "unknown"),
            "class": {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code": pv1[2] if len(pv1) > 2 and pv1[2] else "AMB",
            },
            "subject": {"reference": f"Patient/{patient_id}"},
        }
        if len(pv1) > 3 and pv1[3]:
            encounter["location"] = [{"location": {"display": pv1[3]}}]
        bundle["entry"].append({"fullUrl": f"urn:uuid:encounter-{encounter_id}", "resource": encounter})

    return bundle


def configured_auto_submit_endpoints() -> list[str]:
    if not settings.fhir_auto_submit_enabled:
        return []

    return [
        endpoint.strip()
        for endpoint in settings.fhir_auto_submit_endpoints.split(",")
        if endpoint.strip()
    ]


def build_fhir_url(base_url: str, resource_type: str, resource_id: str | None = None) -> str:
    parsed = urlparse(base_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Endpoint must be a valid http or https URL")

    normalized_base = base_url.rstrip("/")
    if resource_id:
        return f"{normalized_base}/{resource_type}/{quote(resource_id, safe='')}"

    return f"{normalized_base}/{resource_type}"


def parse_fhir_response_body(response: httpx.Response) -> Any:
    try:
        return response.json()
    except ValueError:
        return response.text[:2000]


def duplicate_resource_id_from_outcome(body: Any, resource_type: str) -> str | None:
    diagnostics: list[str] = []
    if isinstance(body, dict):
        for issue in body.get("issue", []):
            if isinstance(issue, dict) and isinstance(issue.get("diagnostics"), str):
                diagnostics.append(issue["diagnostics"])

        text = body.get("text")
        if isinstance(text, dict) and isinstance(text.get("div"), str):
            diagnostics.append(text["div"])
    elif isinstance(body, str):
        diagnostics.append(body)

    for diagnostic in diagnostics:
        match = DUPLICATE_RESOURCE_PATTERN.search(diagnostic)
        if match and match.group(1) == resource_type:
            return match.group(2)

    return None


def result_from_response(endpoint: str, url: str, method: str, response: httpx.Response) -> dict[str, Any]:
    return {
        "endpoint": endpoint,
        "url": url,
        "method": method,
        "ok": response.is_success,
        "statusCode": response.status_code,
        "response": parse_fhir_response_body(response),
    }


def auto_submit_fhir_resource(resource: dict[str, Any]) -> list[dict[str, Any]]:
    endpoints = configured_auto_submit_endpoints()
    if not endpoints:
        return []

    resource_type = resource.get("resourceType")
    if not resource_type:
        return [{"ok": False, "error": "FHIR resource missing resourceType"}]

    results = []
    with httpx.Client(timeout=20.0) as client:
        for endpoint in endpoints:
            try:
                resource_id = resource.get("id")
                method = "PUT" if resource_id else "POST"
                url = build_fhir_url(endpoint, resource_type, str(resource_id) if resource_id else None)
                response = client.request(
                    method,
                    url,
                    json=resource,
                    headers=FHIR_HEADERS,
                )
                result = result_from_response(endpoint, url, method, response)

                duplicate_id = None
                if response.status_code == 412:
                    duplicate_id = duplicate_resource_id_from_outcome(result["response"], resource_type)

                if duplicate_id:
                    retry_resource = {**resource, "id": duplicate_id}
                    retry_method = "PUT"
                    retry_url = build_fhir_url(endpoint, resource_type, duplicate_id)
                    retry_response = client.request(
                        retry_method,
                        retry_url,
                        json=retry_resource,
                        headers=FHIR_HEADERS,
                    )
                    result = result_from_response(endpoint, retry_url, retry_method, retry_response)
                    result["retriedAfterDuplicate"] = True
                    result["duplicateResourceId"] = duplicate_id
                    result["originalUrl"] = url
                    result["originalStatusCode"] = response.status_code

                results.append(result)
            except Exception as exc:
                results.append({"endpoint": endpoint, "ok": False, "error": str(exc)})

    return results

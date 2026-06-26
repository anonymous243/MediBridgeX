from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from app.models.patient import PatientCreate


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

        identifier: dict[str, Any] = {
            "use": "usual",
            "value": value,
        }
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


def convert_json_patient_to_fhir(patient: PatientCreate) -> dict[str, Any]:
    patient_id = patient.external_id or str(uuid4())
    name_parts = patient.name.split()
    family_name = name_parts[-1]
    given_names = name_parts[:-1] or [patient.name]

    fhir_patient: dict[str, Any] = {
        "resourceType": "Patient",
        "id": patient_id,
        "active": True,
        "identifier": [{"use": "usual", "value": patient_id}],
        "name": [
            {
                "use": "official",
                "family": family_name,
                "given": given_names,
                "text": patient.name,
            }
        ],
        "gender": patient.gender,
        "birthDate": patient.dob.isoformat(),
    }

    if patient.phone:
        fhir_patient["telecom"] = [{"system": "phone", "value": patient.phone, "use": "mobile"}]
    if patient.address:
        fhir_patient["address"] = [{"use": "home", "text": patient.address}]

    return fhir_patient


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

    timestamp = datetime.now(timezone.utc).isoformat()
    bundle: dict[str, Any] = {
        "resourceType": "Bundle",
        "id": message_id,
        "type": "message",
        "timestamp": timestamp,
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

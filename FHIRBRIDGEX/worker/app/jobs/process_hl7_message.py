from typing import Any

from sqlalchemy import select

from app.database import get_session
from app.models import HL7Record
from app.services import auto_submit_fhir_resource, convert_hl7_to_fhir_patient


def process_hl7_message(message: dict[str, Any]) -> None:
    message_id = message.get("id", "unknown")
    hl7_message = message.get("message", "")
    first_segment = hl7_message.splitlines()[0] if hl7_message else "empty"
    message_type = "unknown"

    if first_segment.startswith("MSH|"):
        fields = first_segment.split("|")
        if len(fields) > 8:
            message_type = fields[8]

    fhir_patient = convert_hl7_to_fhir_patient(message_id, hl7_message)
    submission_results = auto_submit_fhir_resource(fhir_patient)

    with get_session() as db:
        record = db.scalar(select(HL7Record).where(HL7Record.message_id == message_id))
        if record is None:
            record = HL7Record(
                message_id=message_id,
                message_type=message_type,
                raw_message=hl7_message,
                fhir_json=fhir_patient,
                fhir_submission_results=submission_results,
                status="processed",
            )
            db.add(record)
        else:
            record.message_type = message_type
            record.raw_message = hl7_message
            record.fhir_json = fhir_patient
            record.fhir_submission_results = submission_results
            record.status = "processed"

        db.commit()

    print(f"Processed HL7 message {message_id}: {first_segment}", flush=True)

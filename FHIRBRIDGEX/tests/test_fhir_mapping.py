import importlib.util
import sys
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from app.models.patient import PatientCreate
from app.services.fhir_submit_service import build_fhir_request, duplicate_resource_id_from_outcome
from app.services.fhir_mapper import convert_json_patient_to_fhir


def load_worker_services():
    config_path = ROOT / "worker" / "app" / "config.py"
    config_spec = importlib.util.spec_from_file_location("app.config", config_path)
    config_module = importlib.util.module_from_spec(config_spec)
    assert config_spec and config_spec.loader
    sys.modules["app.config"] = config_module
    config_spec.loader.exec_module(config_module)

    module_path = ROOT / "worker" / "app" / "services.py"
    spec = importlib.util.spec_from_file_location("worker_services", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


worker_services = load_worker_services()


def assert_patient_resource(resource):
    assert resource["resourceType"] == "Patient"
    assert resource["id"]
    assert resource["identifier"]
    assert resource["name"][0]["family"]
    assert resource["gender"] in {"male", "female", "other", "unknown"}
    if "birthDate" in resource:
        assert len(resource["birthDate"]) == 10


def assert_adt_bundle(bundle, trigger_event, encounter_status):
    assert bundle["resourceType"] == "Bundle"
    assert bundle["type"] == "message"
    assert bundle["entry"]

    resources = [entry["resource"] for entry in bundle["entry"]]
    message_header = next(resource for resource in resources if resource["resourceType"] == "MessageHeader")
    patient = next(resource for resource in resources if resource["resourceType"] == "Patient")
    encounter = next(resource for resource in resources if resource["resourceType"] == "Encounter")

    assert message_header["eventCoding"]["code"] == trigger_event
    assert_patient_resource(patient)
    assert encounter["status"] == encounter_status
    assert encounter["subject"]["reference"] == f"Patient/{patient['id']}"


def test_json_patient_maps_to_fhir_patient():
    patient = PatientCreate(
        external_id="JSON-100",
        name="Ada Lovelace",
        dob=date(1815, 12, 10),
        gender="female",
        phone="5551234567",
        address="1 Analytical Engine Way",
    )

    resource = convert_json_patient_to_fhir(patient)

    assert_patient_resource(resource)
    assert resource["active"] is True
    assert resource["identifier"][0]["value"] == "JSON-100"
    assert resource["telecom"][0]["system"] == "phone"
    assert resource["address"][0]["text"] == "1 Analytical Engine Way"


def test_hl7_adt_messages_map_to_fhir_bundle():
    cases = [
        ("A01", "in-progress"),
        ("A03", "finished"),
        ("A04", "in-progress"),
        ("A08", "in-progress"),
        ("A11", "cancelled"),
    ]

    for trigger_event, encounter_status in cases:
        hl7 = (
            f"MSH|^~\\&|FHIRBRIDGE|TEST|HOSP|DEST|202605190900||ADT^{trigger_event}|MSG{trigger_event}|P|2.5\r"
            "PID|1||12345^^^MRN^MR||Doe^Jane^A||19850412|F|||10 Main St^^Boston^MA^02110^USA||5551112222|5553334444\r"
            "PV1|1|I|ER^01^A"
        )

        bundle = worker_services.convert_hl7_adt_to_fhir_bundle(f"msg-{trigger_event}", hl7)
        assert_adt_bundle(bundle, trigger_event, encounter_status)


def test_submit_uses_update_for_existing_resource_id():
    resource = {"resourceType": "Patient", "id": "132072545", "active": True}

    method, url = build_fhir_request("https://hapi.fhir.org/baseR4", resource, "submit")

    assert method == "PUT"
    assert url == "https://hapi.fhir.org/baseR4/Patient/132072545"


def test_submit_uses_create_for_resource_without_id():
    resource = {"resourceType": "Patient", "active": True}

    method, url = build_fhir_request("https://hapi.fhir.org/baseR4", resource, "submit")

    assert method == "POST"
    assert url == "https://hapi.fhir.org/baseR4/Patient"


def test_validate_posts_to_validate_operation_even_with_id():
    resource = {"resourceType": "Patient", "id": "132072545", "active": True}

    method, url = build_fhir_request("https://hapi.fhir.org/baseR4", resource, "validate")

    assert method == "POST"
    assert url == "https://hapi.fhir.org/baseR4/Patient/$validate"


def test_duplicate_existing_patient_id_is_extracted_from_operation_outcome():
    outcome = {
        "resourceType": "OperationOutcome",
        "issue": [
            {
                "severity": "error",
                "code": "processing",
                "diagnostics": "HAPI-2840: Can not create resource duplicating existing resource: Patient/132072545",
            }
        ],
    }

    duplicate_id = duplicate_resource_id_from_outcome(outcome, "Patient")

    assert duplicate_id == "132072545"


def test_duplicate_existing_id_ignores_other_resource_types():
    outcome = {
        "resourceType": "OperationOutcome",
        "issue": [
            {
                "severity": "error",
                "code": "processing",
                "diagnostics": "HAPI-2840: Can not create resource duplicating existing resource: Encounter/abc",
            }
        ],
    }

    duplicate_id = duplicate_resource_id_from_outcome(outcome, "Patient")

    assert duplicate_id is None


if __name__ == "__main__":
    test_json_patient_maps_to_fhir_patient()
    test_hl7_adt_messages_map_to_fhir_bundle()
    test_submit_uses_update_for_existing_resource_id()
    test_submit_uses_create_for_resource_without_id()
    test_validate_posts_to_validate_operation_even_with_id()
    test_duplicate_existing_patient_id_is_extracted_from_operation_outcome()
    test_duplicate_existing_id_ignores_other_resource_types()
    print("FHIR mapping tests passed")

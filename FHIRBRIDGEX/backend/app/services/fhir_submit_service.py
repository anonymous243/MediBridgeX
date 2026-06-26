import re
from typing import Any, Literal
from urllib.parse import quote, urlparse

import httpx

from app.core.config import settings


SubmitMode = Literal["validate", "submit"]
FHIR_HEADERS = {
    "Accept": "application/fhir+json, application/json",
    "Content-Type": "application/fhir+json",
}
DUPLICATE_RESOURCE_PATTERN = re.compile(
    r"Can not create resource duplicating existing resource: ([A-Za-z]+)/([A-Za-z0-9\-._~]+)"
)


def build_fhir_url(base_url: str, resource_type: str, mode: SubmitMode, resource_id: str | None = None) -> str:
    parsed = urlparse(base_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Endpoint must be a valid http or https URL")

    normalized_base = base_url.rstrip("/")
    if mode == "validate":
        return f"{normalized_base}/{resource_type}/$validate"

    if resource_id:
        return f"{normalized_base}/{resource_type}/{quote(resource_id, safe='')}"

    return f"{normalized_base}/{resource_type}"


def build_fhir_request(base_url: str, resource: dict[str, Any], mode: SubmitMode) -> tuple[str, str]:
    resource_type = resource.get("resourceType")
    if not resource_type:
        raise ValueError("FHIR resource must include resourceType")

    resource_id = resource.get("id")
    method = "PUT" if mode == "submit" and resource_id else "POST"
    url = build_fhir_url(
        base_url,
        resource_type,
        mode,
        str(resource_id) if resource_id else None,
    )
    return method, url


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


def submit_fhir_resource(
    resource: dict[str, Any],
    endpoints: list[str],
    mode: SubmitMode,
) -> list[dict[str, Any]]:
    resource_type = resource.get("resourceType")
    if not resource_type:
        raise ValueError("FHIR resource must include resourceType")

    results = []
    with httpx.Client(timeout=20.0) as client:
        for endpoint in endpoints:
            try:
                method, url = build_fhir_request(endpoint, resource, mode)
                response = client.request(
                    method,
                    url,
                    json=resource,
                    headers=FHIR_HEADERS,
                )
                result = result_from_response(endpoint, url, method, response)

                duplicate_id = None
                if mode == "submit" and response.status_code == 412:
                    duplicate_id = duplicate_resource_id_from_outcome(result["response"], resource_type)

                if duplicate_id:
                    retry_resource = {**resource, "id": duplicate_id}
                    retry_method, retry_url = build_fhir_request(endpoint, retry_resource, mode)
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
                results.append(
                    {
                        "endpoint": endpoint,
                        "ok": False,
                        "error": str(exc),
                    }
                )

    return results


def configured_auto_submit_endpoints() -> list[str]:
    if not settings.fhir_auto_submit_enabled:
        return []

    return [
        endpoint.strip()
        for endpoint in settings.fhir_auto_submit_endpoints.split(",")
        if endpoint.strip()
    ]


def auto_submit_fhir_resource(resource: dict[str, Any]) -> list[dict[str, Any]]:
    endpoints = configured_auto_submit_endpoints()
    if not endpoints:
        return []

    return submit_fhir_resource(resource, endpoints, "submit")

# MediBridgeX API Contract

This document outlines the API endpoints the Next.js frontend currently expects to communicate with.
It serves as a guide for the backend developer (FastAPI) to implement the matching routes.

## Base URL
All routes are prefixed with `/api/v1` (configurable via `NEXT_PUBLIC_API_URL`).

## 1. Authentication
The frontend uses standard token-based authentication (JWT expected). The token is stored in `localStorage` and sent in the `Authorization: Bearer <token>` header.

- `POST /auth/login` - Authenticates user, returns token and basic user info.
- `POST /auth/logout` - Invalidates the current session.
- `POST /auth/refresh` - Refreshes the JWT token.
- `GET /auth/me` - Returns the current `SessionUser` object including role and `permissions` array.

## 2. Onboarding
- `POST /onboarding/submit` - Submits the workspace setup data (organization details, region).
- `GET /onboarding/status` - Checks if the user's workspace is provisioned.

## 3. Dashboard Overview
- `GET /dashboard/overview` - Returns aggregated metrics for the dashboard home:
  - `metrics` (messagesToday, fhirConversions, connectedSystems, complianceStatus)
  - `trafficAnalytics` (array of numbers for the bar chart)
  - `liveSystems` (array of objects with title, status, time)

## 4. Messages (HL7/FHIR Pipeline)
- `GET /messages/stream` - Returns the list of recent messages for the data table.
- `GET /messages/:id` - Returns detailed payload and transformation status for a specific message.
- `GET /messages/metrics` - Returns pipeline throughput and latency statistics.
- `POST /messages/:id/retry` - Retries a failed message transformation.

## 5. FHIR Explorer
- `GET /fhir/resources` - Returns a paginated list of FHIR resources.
- `GET /fhir/resources/:id` - Returns the raw JSON of a specific FHIR resource.
- `GET /fhir/search` - Searches resources based on specific criteria.
- `GET /fhir/audit-logs` - Returns audit trail for FHIR data access.

## 6. Developer Platform
- `GET /developers/api-keys` - Lists API keys for the workspace.
- `GET /developers/webhooks` - Lists registered webhooks.
- `GET /developers/logs` - Returns system developer logs.
- `GET /developers/metrics` - Returns API usage metrics (requests, errors, latency).

## 7. Integrations
- `GET /integrations` - Returns the list of active systems (e.g., Epic, Cerner) connected to the pipeline.
- `GET /integrations/stats` - Returns uptime and throughput stats per integration.

## 8. Settings
- `GET /settings/organization` - Returns workspace/org details.
- `GET /settings/team` - Returns list of members.
- `GET /settings/compliance` - Returns compliance configurations.

*Note: While the frontend currently mocks these endpoints if `NEXT_PUBLIC_MOCK_API=true`, implementing these routes on the FastAPI backend will allow seamless real-time data flowing into the dashboard.*

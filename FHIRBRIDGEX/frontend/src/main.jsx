import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Database,
  LayoutDashboard,
  RefreshCw,
  Search,
  FileJson,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import "./styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
const DEFAULT_ENDPOINTS = [
  {
    id: "hapi-r4",
    name: "HAPI FHIR R4 Public Test Server",
    url: "https://hapi.fhir.org/baseR4",
    selected: true,
  },
];

function compactId(value) {
  if (!value) return "";
  if (value.length <= 12) return value;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function displayProcessingStatus(status) {
  if (status === "processed") return "Bridge processed";
  return status;
}

function ensureHapiSelected(endpointList) {
  const hasHapi = endpointList.some((endpoint) => endpoint.id === "hapi-r4");
  const normalized = endpointList.map((endpoint) =>
    endpoint.id === "hapi-r4" ? { ...endpoint, selected: true } : endpoint,
  );

  return hasHapi ? normalized : [{ ...DEFAULT_ENDPOINTS[0], selected: true }, ...normalized];
}

function loadEndpoints() {
  try {
    const saved = window.localStorage.getItem("fhirbridge-endpoints");
    return ensureHapiSelected(saved ? JSON.parse(saved) : DEFAULT_ENDPOINTS);
  } catch {
    return ensureHapiSelected(DEFAULT_ENDPOINTS);
  }
}

function App() {
  const [patients, setPatients] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("logs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [fhirResource, setFhirResource] = useState(null);
  const [fhirDraft, setFhirDraft] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [endpoints, setEndpoints] = useState(loadEndpoints);
  const [endpointName, setEndpointName] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [submitMode, setSubmitMode] = useState("validate");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [patientsResponse, hl7Response] = await Promise.all([
        fetch(`${API_BASE_URL}/api/patient-records`),
        fetch(`${API_BASE_URL}/api/dashboard-events`),
      ]);

      if (!patientsResponse.ok || !hl7Response.ok) {
        throw new Error("Unable to load dashboard data");
      }

      setPatients(await patientsResponse.json());
      setEvents(await hl7Response.json());
    } catch (err) {
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("fhirbridge-endpoints", JSON.stringify(endpoints));
  }, [endpoints]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return events;

    return events.filter((event) =>
      [event.id, event.source, event.type, event.status, event.submissionStatus]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [events, query]);

  const fetchFhirResource = async (resourceId = lookupId) => {
    const normalizedId = resourceId.trim();
    if (!normalizedId) return;

    setActiveTab("submit");
    setEndpoints((current) => ensureHapiSelected(current));
    setLookupId(normalizedId);
    setLookupLoading(true);
    setLookupError("");
    setFhirResource(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/fhir/${normalizedId}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? "FHIR resource not found yet" : "Unable to load FHIR resource");
      }

      const resource = await response.json();
      setFhirResource(resource);
      setFhirDraft(JSON.stringify(resource, null, 2));
    } catch (err) {
      setLookupError(err.message || "Unable to load FHIR resource");
    } finally {
      setLookupLoading(false);
    }
  };

  const addEndpoint = () => {
    const cleanedUrl = endpointUrl.trim();
    if (!cleanedUrl) return;

    setEndpoints((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: endpointName.trim() || "FHIR Endpoint",
        url: cleanedUrl,
        selected: true,
      },
    ]);
    setEndpointName("");
    setEndpointUrl("");
  };

  const updateEndpoint = (id, field, value) => {
    setEndpoints((current) =>
      current.map((endpoint) => (endpoint.id === id ? { ...endpoint, [field]: value } : endpoint)),
    );
  };

  const removeEndpoint = (id) => {
    setEndpoints((current) => current.filter((endpoint) => endpoint.id !== id));
  };

  const submitToEndpoints = async (mode) => {
    const selectedEndpoints = endpoints.filter((endpoint) => endpoint.selected && endpoint.url.trim());
    if (!lookupId.trim()) {
      setSubmitError("Choose a FHIR resource ID first");
      return;
    }
    if (selectedEndpoints.length === 0) {
      setSubmitError("Select at least one endpoint");
      return;
    }

    setSubmitMode(mode);
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitResult(null);

    try {
      let editedResource = null;
      if (fhirDraft.trim()) {
        editedResource = JSON.parse(fhirDraft);
      }

      const response = await fetch(`${API_BASE_URL}/api/fhir/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_id: lookupId.trim(),
          endpoints: selectedEndpoints.map((endpoint) => endpoint.url.trim()),
          mode,
          resource: editedResource,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || "FHIR endpoint submission failed");
      }

      setSubmitResult(await response.json());
    } catch (err) {
      setSubmitError(err.message || "FHIR endpoint submission failed. Check that the FHIR JSON is valid.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Database size={22} />
          <span>FHIRBridge</span>
        </div>
        <nav className="nav-list" aria-label="Primary">
          <a className="nav-item active" href="/">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a className="nav-item" href="http://127.0.0.1:8000/docs">
            <Activity size={18} />
            API Docs
          </a>
          <a className="nav-item" href="http://127.0.0.1:15672">
            <Database size={18} />
            RabbitMQ
          </a>
        </nav>
      </aside>

      <main className="dashboard">
        <header className="page-header">
          <div>
            <p className="eyebrow">Healthcare Interoperability</p>
            <h1>Dashboard</h1>
          </div>
          <button className="icon-button" onClick={fetchDashboard} disabled={loading} title="Refresh dashboard">
            <RefreshCw size={18} />
            Refresh
          </button>
        </header>

        <section className="metrics" aria-label="Dashboard metrics">
          <div className="metric">
            <span>Patients</span>
            <strong>{patients.length}</strong>
          </div>
          <div className="metric">
            <span>HL7 Messages</span>
            <strong>{events.filter((event) => event.source === "HL7").length}</strong>
          </div>
          <div className="metric">
            <span>Queued</span>
            <strong>{events.filter((event) => event.status === "queued").length}</strong>
          </div>
          <div className="metric">
            <span>Processed</span>
            <strong>{events.filter((event) => event.status === "processed").length}</strong>
          </div>
          <div className="metric">
            <span>API Status</span>
            <strong>{error ? "Issue" : "Ready"}</strong>
          </div>
        </section>

        <div className="tabs" role="tablist" aria-label="Dashboard sections">
          <button
            className={`tab-button ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => setActiveTab("logs")}
            type="button"
          >
            Logs
          </button>
          <button
            className={`tab-button ${activeTab === "submit" ? "active" : ""}`}
            onClick={() => setActiveTab("submit")}
            type="button"
          >
            Endpoint Submit
          </button>
        </div>

        {activeTab === "logs" && (
          <section className="table-section">
          <div className="section-toolbar">
            <div>
              <h2>Logs</h2>
              <p>JSON Patient and HL7 submissions processed by FHIRBridge.</p>
            </div>
            <label className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search dashboard"
              />
            </label>
          </div>

          {error && <div className="notice error">{error}</div>}
          {!error && loading && <div className="notice">Loading dashboard...</div>}
          {!error && !loading && filteredEvents.length === 0 && (
            <div className="empty-state">
              <Activity size={28} />
              <span>No dashboard records found</span>
            </div>
          )}

          {!error && filteredEvents.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>FHIR Submit</th>
                    <th>ID</th>
                    <th>FHIR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={`${event.source}-${event.id}`}>
                      <td>{event.source}</td>
                      <td>{event.type}</td>
                      <td>
                        <span className={`status-pill ${event.status}`}>{displayProcessingStatus(event.status)}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${event.submissionStatus}`}>
                          {event.submissionStatus}
                        </span>
                      </td>
                      <td className="mono" title={event.id}>{compactId(event.id)}</td>
                      <td>
                        <button className="table-action" onClick={() => fetchFhirResource(event.id)}>
                          View/Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </section>
        )}

        {activeTab === "submit" && (
          <section className="lookup-section">
            <div>
              <h2>Endpoint Submit</h2>
              <p>Load FHIR by ID, edit if needed, then submit to one or more FHIR endpoints.</p>
            </div>

            <div className="lookup-controls">
              <label className="search-box">
                <FileJson size={17} />
                <input
                  value={lookupId}
                  onChange={(event) => setLookupId(event.target.value)}
                  placeholder="FHIR resource ID"
                />
              </label>
              <button className="icon-button" onClick={() => fetchFhirResource()} disabled={lookupLoading}>
                Load FHIR
              </button>
            </div>
            {lookupError && <div className="notice error compact">{lookupError}</div>}

            <div className="endpoint-form">
              <input
                value={endpointName}
                onChange={(event) => setEndpointName(event.target.value)}
                placeholder="Endpoint name"
              />
              <input
                value={endpointUrl}
                onChange={(event) => setEndpointUrl(event.target.value)}
                placeholder="FHIR base URL, e.g. https://server.example/fhir"
              />
              <button className="icon-button" onClick={addEndpoint}>
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="endpoint-list">
              {endpoints.map((endpoint) => (
                <div className="endpoint-row" key={endpoint.id}>
                  <input
                    aria-label={`Select ${endpoint.name}`}
                    type="checkbox"
                    checked={endpoint.selected}
                    onChange={(event) => updateEndpoint(endpoint.id, "selected", event.target.checked)}
                  />
                  <input
                    value={endpoint.name}
                    onChange={(event) => updateEndpoint(endpoint.id, "name", event.target.value)}
                    aria-label="Endpoint name"
                  />
                  <input
                    value={endpoint.url}
                    onChange={(event) => updateEndpoint(endpoint.id, "url", event.target.value)}
                    aria-label="Endpoint URL"
                  />
                  <button className="icon-only" onClick={() => removeEndpoint(endpoint.id)} title="Remove endpoint">
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            <div className="lookup-controls">
              <button className="icon-button" onClick={() => submitToEndpoints("submit")} disabled={submitLoading}>
                <Send size={17} />
                Submit
              </button>
            </div>

            {submitError && <div className="notice error compact">{submitError}</div>}
            {fhirDraft && (
              <textarea
                className="json-editor"
                value={fhirDraft}
                onChange={(event) => setFhirDraft(event.target.value)}
                spellCheck="false"
              />
            )}
            {submitResult && (
              <div className="submit-results">
                <h3>Submission Results</h3>
                {submitResult.results.map((result) => (
                  <div className="result-row" key={`${result.endpoint}-${result.statusCode || result.error}`}>
                    <div>
                      <strong>{result.endpoint}</strong>
                      <span className={`status-pill ${result.ok ? "processed" : "queued"}`}>
                        {result.ok ? "ok" : "failed"}
                      </span>
                    </div>
                    <pre className="json-viewer">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

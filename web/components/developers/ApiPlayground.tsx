'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Trash2, 
  Copy, 
  Send, 
  Settings2,
  ChevronDown,
  Database,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

const FHIR_RESOURCES = [
  { name: 'Patient', method: 'GET', path: '/fhir/Patient/pat_9281' },
  { name: 'Observation', method: 'POST', path: '/fhir/Observation', initialBody: {
    resourceType: "Observation",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "85354-9" }] },
    subject: { reference: "Patient/pat_9281" },
    valueQuantity: { value: 120, unit: "mmHg" }
  }},
  { name: 'Encounter', method: 'GET', path: '/fhir/Encounter?patient=pat_9281' },
  { name: 'Condition', method: 'GET', path: '/fhir/Condition/cond_102' },
  { name: 'MedicationRequest', method: 'GET', path: '/fhir/MedicationRequest/med_503' },
];

interface PlaygroundResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
}

export function ApiPlayground() {
  const [selectedResource, setSelectedResource] = useState(FHIR_RESOURCES[0]);
  const [requestBody, setRequestBody] = useState(JSON.stringify(selectedResource.initialBody || {}, null, 2));
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setResponse({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/fhir+json",
          "x-request-id": "req_82j1...m9P"
        },
        body: {
          resourceType: selectedResource.name,
          id: selectedResource.path.split('/').pop() || "new_id",
          meta: { lastUpdated: new Date().toISOString() },
          text: { status: "generated", div: "<div>...</div>" },
          // Add some mock clinical data
          ...(selectedResource.name === 'Patient' ? { name: [{ family: "Smith", given: ["John"] }] } : {})
        }
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* REQUEST EDITOR */}
      <div className="flex-1 space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
              <Settings2 className="h-4 w-4" /> Request Configuration
            </h3>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">Environment:</span>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-600">Test Mode</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Endpoint Selector */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <select 
                  className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-bold text-slate-900 outline-none appearance-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={(e) => {
                    const res = FHIR_RESOURCES.find(r => r.name === e.target.value);
                    if (res) {
                      setSelectedResource(res);
                      setRequestBody(JSON.stringify(res.initialBody || {}, null, 2));
                      setResponse(null);
                    }
                  }}
                  value={selectedResource.name}
                >
                  {FHIR_RESOURCES.map(res => (
                    <option key={res.name} value={res.name}>{res.method} {res.path}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleExecute}
                disabled={isLoading}
                className="flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                Run
              </button>
            </div>

            {/* Auth Token (Mock) */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Authorization</label>
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <span className="text-xs font-bold text-slate-400 shrink-0">Bearer</span>
                <input 
                  type="password" 
                  value="mbx_test_••••••••••••••••••••" 
                  readOnly
                  className="flex-1 bg-transparent text-sm font-mono text-slate-600 outline-none"
                />
              </div>
            </div>

            {/* JSON Editor */}
            {selectedResource.method === 'POST' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Request Body (JSON)</label>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">Format JSON</button>
                </div>
                <textarea 
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-800 bg-slate-950 p-6 font-mono text-xs text-blue-400 outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* cURL Example */}
        <div className="space-y-2">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Example Request (cURL)</span>
           <CodeBlock 
              language="bash" 
              code={`curl -X ${selectedResource.method} "https://api.medibridgex.com${selectedResource.path}" \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" ${selectedResource.method === 'POST' ? `\\
  -d '${requestBody.replace(/'/g, "'\\''")}'` : ''}`}
           />
        </div>
      </div>

      {/* RESPONSE VIEWER */}
      <div className="flex-1 space-y-4">
        <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[500px]">
          <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
              <Database className="h-4 w-4" /> Response Output
            </h3>
            {response && (
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">{response.status} {response.statusText}</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {response ? (
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 p-6 overflow-auto scrollbar-hide">
                        <pre className="font-mono text-xs leading-relaxed text-blue-400">
                            {JSON.stringify(response.body, null, 2)}
                        </pre>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                             Size: {(JSON.stringify(response.body).length / 1024).toFixed(2)} KB
                         </span>
                         <div className="flex gap-2">
                             <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 transition-colors">
                                 <Copy className="h-3 w-3" />
                             </button>
                             <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-rose-600 transition-colors">
                                 <Trash2 className="h-3 w-3" />
                             </button>
                         </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <Send className="h-12 w-12 opacity-10 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Execute a request to see output</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RefreshCcw({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 21v-5h5"/>
        </svg>
    )
}

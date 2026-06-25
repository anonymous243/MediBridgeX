import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Errors | MediBridgeX Docs',
  description: 'RFC 7807 Problem Details and FHIR OperationOutcome error formatting.',
};

export default function ErrorsPage() {
  const fhirError = `{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "details": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/ValueSet/operation-outcome",
            "code": "MSG_PARAM_INVALID"
          }
        ],
        "text": "Invalid parameter 'birthDate'. Expected format YYYY-MM-DD."
      },
      "expression": [
        "Patient.birthDate"
      ]
    }
  ]
}`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Handling Errors</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          MediBridgeX strictly adheres to the FHIR R4 <code>OperationOutcome</code> specification for data validation errors, and uses RFC 7807 (Problem Details for HTTP APIs) for gateway-level networking faults.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FHIR Validation Errors</h2>
          <p className="text-gray-600 mb-6">
            When our engine detects malformed FHIR payloads or invalid HL7 mappings, it immediately returns a <code>400 Bad Request</code> or <code>422 Unprocessable Entity</code>. The response body will contain an <code>OperationOutcome</code> resource detailing the exact JSON Path expression that failed validation.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Validation Failure Response" 
              code={fhirError} 
              language="json" 
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">HTTP Status Codes</h2>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded text-sm mt-1">400</span>
              <div>
                <strong>Bad Request</strong>
                <p className="text-gray-600 text-sm mt-1">Malformed syntax in the request payload or missing required parameters.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded text-sm mt-1">401</span>
              <div>
                <strong>Unauthorized</strong>
                <p className="text-gray-600 text-sm mt-1">Invalid, expired, or missing Bearer token in the Authorization header.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded text-sm mt-1">403</span>
              <div>
                <strong>Forbidden</strong>
                <p className="text-gray-600 text-sm mt-1">The JWT lacks the required OAuth 2.0 scopes to access this resource.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded text-sm mt-1">404</span>
              <div>
                <strong>Not Found</strong>
                <p className="text-gray-600 text-sm mt-1">The requested FHIR resource ID does not exist in the tenant's data silo.</p>
              </div>
            </li>
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}

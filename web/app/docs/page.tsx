import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Documentation | MediBridgeX',
  description: 'Learn how to integrate with the MediBridgeX FHIR and HL7 platform.',
};

export default function DocsIntroductionPage() {
  const sampleAuthCode = `curl -X POST https://api.medibridgex.com/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "grant_type": "client_credentials"
  }'`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <div className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 ring-1 ring-inset ring-purple-600/20">
          MediBridgeX API v1.0
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Introduction
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          Welcome to the MediBridgeX Developer Documentation. Our platform provides a suite of APIs for processing HL7v2 messages, validating FHIR R4 resources, and maintaining HIPAA-compliant cryptographic audit trails.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Base URL</h2>
          <p className="text-gray-600 mb-6">
            All API requests should be prefixed with the following base URL. We recommend using HTTPS for all requests to ensure data encryption in transit.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-10 font-mono text-sm text-gray-800">
            https://api.medibridgex.com/v1
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Authentication</h2>
          <p className="text-gray-600 mb-6">
            The MediBridgeX API uses OAuth 2.0 Client Credentials flow for server-to-server communication. You can generate your API keys in the Developer Dashboard.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Generate Bearer Token" 
              code={sampleAuthCode} 
              language="bash" 
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Response Formats</h2>
          <p className="text-gray-600 mb-6">
            The API exclusively returns JSON. All successful responses will have a <code>2xx</code> status code, while errors will return <code>4xx</code> or <code>5xx</code> along with a standardized error object.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">RESTful Design</h3>
              <p className="text-sm text-gray-600">Standard HTTP verbs (GET, POST, PUT, DELETE) are used to perform CRUD operations on FHIR resources.</p>
            </div>
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Cryptographic Logs</h3>
              <p className="text-sm text-gray-600">Every mutation is automatically recorded in the HIPAA Audit Trail with an immutable SHA-256 signature.</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

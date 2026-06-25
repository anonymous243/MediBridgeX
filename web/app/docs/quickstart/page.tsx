import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Quickstart | MediBridgeX Docs',
  description: 'Get up and running with MediBridgeX in under 5 minutes.',
};

export default function DocsQuickstartPage() {
  const hl7Payload = `curl -X POST https://api.medibridgex.com/v1/messages/hl7 \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: text/plain" \\
  -d "MSH|^~\\&|SENDING_APP|SENDING_FAC|RECV_APP|RECV_FAC|20231027101530||ADT^A01|MSG00001|P|2.4
PID|1||87453||Doe^John^A||19800101|M|||123 Main St^^Citytown^CA^90210"`;

  const fhirResponse = `{
  "status": "success",
  "data": {
    "resourceType": "Bundle",
    "type": "transaction",
    "entry": [
      {
        "resource": {
          "resourceType": "Patient",
          "id": "pat-87453",
          "name": [
            {
              "family": "Doe",
              "given": ["John", "A"]
            }
          ],
          "gender": "male",
          "birthDate": "1980-01-01"
        }
      }
    ]
  }
}`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <div className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 ring-1 ring-inset ring-purple-600/20">
          5 Minute Setup
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Quickstart Guide
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          Learn how to authenticate, send your first legacy HL7v2 message, and instantly receive standardized FHIR R4 resources back.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">1</span>
            Get your API Keys
          </h2>
          <p className="text-gray-600 mb-6">
            Before making any requests, you need to generate your OAuth 2.0 Client Credentials. 
            Navigate to your <strong>Developer Dashboard</strong> → <strong>API Keys</strong> and click "Generate New Secret".
            Use these credentials to request a Bearer token as shown in the Introduction.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">2</span>
            Send an HL7v2 Message
          </h2>
          <p className="text-gray-600 mb-6">
            MediBridgeX acts as a universal translator. You can POST raw, pipe-delimited HL7v2 text directly to our ingestion endpoint. 
            Our engine will automatically parse, map, and convert it.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Ingest HL7v2 ADT Message" 
              code={hl7Payload} 
              language="bash" 
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">3</span>
            Receive FHIR R4
          </h2>
          <p className="text-gray-600 mb-6">
            Instantly, the engine responds with a fully compliant FHIR R4 Transaction Bundle. The patient data has been cleanly extracted and mapped. Note that this action was automatically recorded in your HIPAA Audit Trail.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Response (200 OK)" 
              code={fhirResponse} 
              language="json" 
            />
          </div>
          
          <div className="mt-16 p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <h3 className="font-bold text-purple-900 mb-2">What's Next?</h3>
            <p className="text-purple-800 text-sm">
              Now that you understand the basic flow, you can explore our webhooks to receive data asynchronously, or dive deeper into the specific FHIR resources we support.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

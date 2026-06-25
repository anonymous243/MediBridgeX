import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'HIPAA Audit Trail | MediBridgeX Docs',
  description: 'Cryptographically signed audit logs for HIPAA compliance and non-repudiation.',
};

export default function AuditTrailPage() {
  const auditJson = `{
  "id": "log_9f8a7c6b",
  "action": "CREATE",
  "resource_type": "Patient",
  "resource_id": "pat-87453",
  "actor_id": "client_8f92a4bc",
  "ip_address": "192.168.1.1",
  "timestamp": "2023-10-27T10:15:30Z",
  "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
}`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">HIPAA Audit Trail</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          Compliance is not an afterthought. Every single read, write, update, and delete action processed by the MediBridgeX API is permanently recorded in our immutable ledger to satisfy HIPAA Security Rule requirements.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cryptographic Signatures</h2>
          <p className="text-gray-600 mb-6">
            To ensure absolute non-repudiation, every audit log entry is signed using an HMAC SHA-256 algorithm linked to the tenant's master cryptographic key. If a database record is ever tampered with at the storage layer, the signature validation will instantly fail, alerting your compliance officers.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Audit Log Record" 
              code={auditJson} 
              language="json" 
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Exporting Logs</h2>
          <p className="text-gray-600 mb-6">
            Audit logs can be streamed in real-time to your own SIEM (Security Information and Event Management) platform via our Webhook infrastructure, or downloaded in bulk CSV/JSON format via the Developer Dashboard.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Data Encryption | MediBridgeX Docs',
  description: 'At-rest and in-transit encryption standards for PHI.',
};

export default function EncryptionPage() {
  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Data Encryption</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          MediBridgeX employs military-grade encryption methodologies to protect Protected Health Information (PHI) both in transit and at rest.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">In Transit</h2>
          <p className="text-gray-600 mb-6">
            All API traffic must be routed over HTTPS. We enforce TLS 1.3 (with fallback to TLS 1.2) using strong cipher suites. Any request made over unencrypted HTTP will be immediately dropped at the Edge before reaching the application layer.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">At Rest</h2>
          <p className="text-gray-600 mb-6">
            All data stored in our PostgreSQL databases, including FHIR resources and audit logs, is encrypted at rest using AES-256. Database volumes are encrypted at the block level, and sensitive individual fields (such as Social Security Numbers) undergo an additional layer of application-level encryption before being written to disk.
          </p>

          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mt-8">
            <h3 className="font-bold text-purple-900 mb-2">BYOK (Bring Your Own Key)</h3>
            <p className="text-purple-800 text-sm">
              Enterprise Dedicated customers have the option to configure Bring Your Own Key (BYOK) via AWS KMS or Azure Key Vault, granting you absolute cryptographic control over your tenant's data.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

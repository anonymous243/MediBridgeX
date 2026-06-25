import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Observation Resource | MediBridgeX Docs',
  description: 'Clinical findings, vital signs, and lab results via the FHIR Observation resource.',
};

export default function ObservationsPage() {
  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono font-bold">GET</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono font-bold">POST</span>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Observation</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          Measurements and simple assertions made about a patient, device or other subject. This includes vital signs, laboratory data, and clinical findings.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Supported Profiles</h2>
          <p className="text-gray-600 mb-6">
            MediBridgeX enforces US Core Profiles for Observations by default. If a submitted payload lacks proper LOINC encoding for standard vitals (e.g., Heart Rate, Blood Pressure), the gateway will return an <code>OperationOutcome</code> warning.
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
            <h3 className="font-bold text-blue-900 mb-2">LOINC Normalization</h3>
            <p className="text-blue-800 text-sm">
              Our enterprise transformation layer can automatically normalize proprietary lab codes (from legacy ORU^R01 messages) into standard LOINC codes based on your tenant's custom mapping dictionary.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

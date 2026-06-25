import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Encounter Resource | MediBridgeX Docs',
  description: 'Manage clinical encounters and admissions via the FHIR Encounter resource.',
};

export default function EncountersPage() {
  const encounterJson = `{
  "resourceType": "Encounter",
  "id": "enc-10293",
  "status": "in-progress",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "IMP",
    "display": "inpatient encounter"
  },
  "subject": {
    "reference": "Patient/pat-87453"
  },
  "period": {
    "start": "2023-10-27T10:15:30Z"
  }
}`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono font-bold">GET</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono font-bold">POST</span>
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-mono font-bold">PUT</span>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Encounter</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          An interaction between a patient and healthcare provider(s) for the purpose of providing healthcare service(s) or assessing the health status of a patient.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">HL7v2 Mappings</h2>
          <p className="text-gray-600 mb-6">
            When MediBridgeX ingests legacy ADT (Admit, Discharge, Transfer) messages, the engine automatically extracts the <code>PV1</code> (Patient Visit) and <code>PV2</code> segments to construct and persist a FHIR Encounter resource linked to the respective Patient.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Mapped Encounter Resource" 
              code={encounterJson} 
              language="json" 
            />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

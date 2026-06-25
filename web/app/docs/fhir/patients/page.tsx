import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Patient Resource | MediBridgeX Docs',
  description: 'CRUD operations and search parameters for the FHIR R4 Patient resource.',
};

export default function PatientsPage() {
  const searchRequest = `curl -G https://api.medibridgex.com/v1/fhir/Patient \\
  -d "family=Smith" \\
  -d "birthdate=ge1970-01-01" \\
  -H "Authorization: Bearer YOUR_TOKEN"`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono font-bold">GET</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono font-bold">POST</span>
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-mono font-bold">PUT</span>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Patient</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          The <code>Patient</code> resource represents the demographics and administrative information about an individual receiving care. It acts as the anchor resource for almost all other clinical data in MediBridgeX.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Search</h2>
          <p className="text-gray-600 mb-6">
            MediBridgeX supports complex FHIR search paradigms out of the box. You can perform highly optimized queries using prefixes (e.g., <code>eq</code>, <code>ne</code>, <code>gt</code>, <code>lt</code>) and modifiers.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Query: Find patients named Smith born after 1970" 
              code={searchRequest} 
              language="bash" 
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Supported Modifiers</h2>
          <table className="min-w-full text-left text-sm whitespace-nowrap mb-12">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Parameter</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              <tr>
                <td className="px-4 py-3 font-mono text-purple-600">_id</td>
                <td className="px-4 py-3 text-gray-600">token</td>
                <td className="px-4 py-3 text-gray-600">Logical id of this artifact</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-600">identifier</td>
                <td className="px-4 py-3 text-gray-600">token</td>
                <td className="px-4 py-3 text-gray-600">A patient identifier (e.g., MRN)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-600">family:exact</td>
                <td className="px-4 py-3 text-gray-600">string</td>
                <td className="px-4 py-3 text-gray-600">A strict case-sensitive match on family name</td>
              </tr>
            </tbody>
          </table>
        </div>
      </FadeIn>
    </div>
  );
}

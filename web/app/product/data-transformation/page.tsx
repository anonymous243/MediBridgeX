import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FeatureHero } from '@/components/marketing/FeatureHero';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { BentoGrid } from '@/components/marketing/BentoGrid';
import { CTABlock } from '@/components/marketing/CTABlock';
import { ArrowRightLeft, FileJson, BrainCircuit, Activity, BookOpen, Layers } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Data Transformation | MediBridgeX',
  description: 'AI-powered healthcare data mapping, terminology standardization, and structural transformation.',
};

export default function DataTransformationPage() {
  const transformFeatures = [
    {
      title: 'AI-Assisted Mapping',
      description: 'Use advanced machine learning to automatically map messy legacy fields to strict FHIR JSON structures.',
      icon: BrainCircuit,
    },
    {
      title: 'Terminology Binding',
      description: 'Automatically crosswalk local hospital jargon into global standards like LOINC, SNOMED CT, and ICD-10.',
      icon: BookOpen,
    },
    {
      title: 'Bi-directional Sync',
      description: 'Not just read-only. Transform FHIR payloads back into HL7 v2 messages to feed legacy EHR systems.',
      icon: ArrowRightLeft,
    },
    {
      title: 'Real-time Cleansing',
      description: 'Identify and fix data anomalies, missing required fields, and formatting errors on the fly.',
      icon: Activity,
    },
    {
      title: 'Custom Logic Builder',
      description: 'Write custom JavaScript mapping functions for complex, edge-case data transformations.',
      icon: FileJson,
    },
    {
      title: 'Batch Processing',
      description: 'Transform millions of historical records with high-throughput batch processing pipelines.',
      icon: Layers,
    },
  ];

  const codeSnippet = `// MediBridgeX Transformation Script (JS)
export function transformHl7ToFhir(hl7Message) {
  // 1. Extract raw segments
  const pid = hl7Message.getSegment('PID');
  const obx = hl7Message.getSegment('OBX');
  
  // 2. Map and cleanse data
  const fhirPatient = {
    resourceType: "Patient",
    identifier: [{
      system: "urn:oid:1.2.36.146.595.217.0.1",
      value: pid.getField(3).getComponent(1)
    }],
    name: [{
      family: pid.getField(5).getComponent(1),
      given: [pid.getField(5).getComponent(2)]
    }],
    gender: mapGender(pid.getField(8)),
    birthDate: formatDate(pid.getField(7))
  };

  // 3. Terminology binding (LOINC)
  const fhirObservation = mapToLoinc(obx);
  
  return { patient: fhirPatient, observation: fhirObservation };
}`;

  return (
    <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-purple-900">
      <Navbar />

      <main>
        <FeatureHero
          badge="INTELLIGENT MAPPING ENGINE"
          title={
            <>
              Flawless <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>Data Transformation</span>
            </>
          }
          description="Convert complex, proprietary hospital data into standardized FHIR resources. Our AI-powered mapping engine normalizes terminologies, cleanses formatting, and ensures perfect compliance."
          primaryCtaText="Start Transforming"
          primaryCtaHref="/auth/sign-up"
        />

        {/* Highlight Section with Code Terminal */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 mb-12 lg:mb-0">
              <FadeIn>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                  The magic behind true interoperability
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Legacy systems speak thousands of different dialects. MediBridgeX acts as your universal translator, taking raw HL7, CSV, or custom XML and structurally converting it into pure, validated FHIR R4.
                </p>
                <ul className="space-y-4">
                  {['Drag-and-drop visual mapping', 'AI-suggested field correlations', 'Extensible with custom Javascript', 'Built-in LOINC/SNOMED dictionaries'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
            <div className="lg:col-span-7">
              <FadeIn delay={0.2}>
                <CodeSnippetTerminal 
                  filename="transformation_engine.js" 
                  code={codeSnippet} 
                  language="javascript" 
                />
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-12 pb-8 text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Advanced Mapping Capabilities
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Solve the hardest parts of healthcare integration with our enterprise toolkit.
              </p>
            </FadeIn>
          </div>
          <BentoGrid items={transformFeatures} />
        </div>

        <CTABlock />
      </main>

      <Footer />
    </div>
  );
}

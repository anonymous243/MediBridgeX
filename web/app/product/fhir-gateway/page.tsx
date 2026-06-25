import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FeatureHero } from '@/components/marketing/FeatureHero';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { BentoGrid } from '@/components/marketing/BentoGrid';
import { CTABlock } from '@/components/marketing/CTABlock';
import { ShieldCheck, Zap, Activity, Globe, Database, Lock } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'FHIR API Gateway | MediBridgeX',
  description: 'Enterprise-grade, SMART on FHIR compliant API gateway for modern healthcare applications.',
};

export default function FhirGatewayPage() {
  const fhirFeatures = [
    {
      title: 'SMART on FHIR Ready',
      description: 'Fully compliant with SMART on FHIR authorization and authentication frameworks right out of the box.',
      icon: ShieldCheck,
    },
    {
      title: 'Sub-millisecond Latency',
      description: 'Engineered for extreme performance. Validate and route thousands of FHIR resources per second.',
      icon: Zap,
    },
    {
      title: 'Strict Validation',
      description: 'Automatic FHIR R4 schema validation ensures bad or malformed data never enters your system.',
      icon: Activity,
    },
    {
      title: 'Interoperable Global Standard',
      description: 'Connect with any modern EHR (Epic, Cerner) using standardized RESTful FHIR endpoints.',
      icon: Globe,
    },
    {
      title: 'JSON/XML Agnostic',
      description: 'Bi-directional support for both FHIR JSON and XML payloads with automatic negotiation.',
      icon: Database,
    },
    {
      title: 'HIPAA Compliant Auditing',
      description: 'Every API request is logged with cryptographic signatures to maintain perfect compliance.',
      icon: Lock,
    },
  ];

  const codeSnippet = `{
  "resourceType": "Patient",
  "id": "pat-123",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-10-27T10:15:30Z"
  },
  "identifier": [
    {
      "system": "http://hospital.org/identifiers",
      "value": "87453"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Doe",
      "given": [
        "John",
        "A."
      ]
    }
  ],
  "gender": "male",
  "birthDate": "1980-01-01"
}`;

  return (
    <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-purple-900">
      <Navbar />

      <main>
        <FeatureHero
          badge="DEVELOPER-FIRST INFRASTRUCTURE"
          title={
            <>
              The world's fastest <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>FHIR API Gateway</span>
            </>
          }
          description="Build modern healthcare applications faster. Our FHIR API Gateway handles validation, routing, security, and compliance so your developers can focus on building products."
          primaryCtaText="Start Building Free"
          primaryCtaHref="/auth/sign-up"
        />

        {/* Highlight Section with Code Terminal */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 mb-12 lg:mb-0">
              <FadeIn>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                  Standardized, RESTful Healthcare Data
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Stop struggling with complex legacy formats. MediBridgeX exposes a beautiful, RESTful API that treats healthcare data like any other modern web resource. Push and pull JSON payloads with zero friction.
                </p>
                <ul className="space-y-4">
                  {['Full CRUD support for all FHIR R4 resources', 'Automatic schema validation', 'Built-in rate limiting and throttling', 'Comprehensive audit trailing'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
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
                  filename="POST /api/v1/fhir/Patient" 
                  code={codeSnippet} 
                  language="json" 
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
                Enterprise-Grade Capabilities
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to deploy compliant healthcare apps in production.
              </p>
            </FadeIn>
          </div>
          <BentoGrid items={fhirFeatures} />
        </div>

        <CTABlock />
      </main>

      <Footer />
    </div>
  );
}

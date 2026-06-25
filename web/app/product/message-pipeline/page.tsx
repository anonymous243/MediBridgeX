import React from "react";
import { Metadata } from "next";
import { FeatureHero } from "@/components/marketing/FeatureHero";
import { CodeSnippetTerminal } from "@/components/marketing/CodeSnippetTerminal";
import { BentoGrid } from "@/components/marketing/BentoGrid";
import { CTABlock } from "@/components/marketing/CTABlock";
import { FadeIn } from "@/components/animations/FadeIn";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "HL7 Message Pipeline | MediBridgeX",
  description: "Ingest, parse, and route legacy HL7 v2 messages with our high-throughput message pipeline.",
};

export default function MessagePipelinePage() {
  const hl7Snippet = `// 1. Ingest raw HL7 v2 from legacy EHR via MLLP or API
const rawHL7 = \`MSH|^~\\&|EPIC|HOSP|MDC|LAB|20231027||ADT^A01|MSG123|P|2.4
PID|1||pat123||Smith^John||19800101|M
PV1|1|I|ICU^101^1||||doc456^Jones^Bob\`;

// 2. The pipeline automatically parses, validates, and normalizes
const response = await fetch('https://api.medibridgex.com/v1/pipeline/ingest', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'text/plain'
  },
  body: rawHL7
});

// 3. Output is clean, structured JSON ready for your app
const result = await response.json();
console.log(result.data.patient.name); // "John Smith"
`;

  const pipelineItems = [
    {
      title: "Real-time MLLP",
      description: "Securely receive messages over TCP/IP using the Minimal Lower Layer Protocol natively at the edge.",
      icon: (props: any) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      className: "md:col-span-2"
    },
    {
      title: "Automated ACK",
      description: "Automatically generate and send HL7 Acknowledgement (ACK/NACK) messages back to the sending facility.",
      icon: (props: any) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Dead Letter Queue",
      description: "Malformed or invalid messages are safely stored in a DLQ for manual review and reprocessing.",
      icon: (props: any) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      title: "Data Normalization",
      description: "Standardize dates, phone numbers, and demographics across different EHR vendors.",
      icon: (props: any) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      className: "md:col-span-2"
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-purple-900">
      <Navbar />
      <main>
      {/* Hero Section */}
      <FeatureHero
        badge="Legacy Integration Engine"
        title={
          <>
            Breathe life into <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>legacy HL7.</span>
          </>
        }
        description="Connect directly to on-premise EHRs. Our Message Pipeline ingests millions of messy HL7 v2 messages, validates them, and transforms them into clean, predictable JSON in real-time."
        primaryCtaText="Start Building Free"
        primaryCtaHref="/auth/sign-up"
      />

      {/* Code Demo Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn delay={0.2} className="order-2 lg:order-1">
              <CodeSnippetTerminal
                filename="ingest_hl7.js"
                code={hl7Snippet}
                language="javascript"
              />
            </FadeIn>
            <FadeIn delay={0.4} className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                From Pipe-Delimited Chaos to <span className="text-pink-500">Structured Data.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop writing custom regex parsers. MediBridgeX handles the complexities of MLLP connections, base64 decoding, segment validation, and character encoding natively at the Edge.
              </p>
              <ul className="space-y-4">
                {[
                  "Native support for ADT, ORU, SIU, and MDM messages.",
                  "Automated ACK/NACK generation for legacy systems.",
                  "Dead-letter queues for malformed message handling.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Enterprise Message Routing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on a high-throughput, fault-tolerant event streaming architecture.
            </p>
          </div>
          <BentoGrid items={pipelineItems} />
        </div>
      </section>

      {/* Bottom CTA */}
      <CTABlock />
      </main>
      <Footer />
    </div>
  );
}

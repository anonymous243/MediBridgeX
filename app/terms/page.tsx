import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsOfServicePage() {
  const lastUpdated = "May 20, 2026";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 sm:px-12 max-w-4xl mx-auto">
        <header className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">
            Last Updated: <span className="font-semibold text-slate-700">{lastUpdated}</span>
          </p>
        </header>

        <article className="prose prose-slate prose-h2:text-slate-800 prose-h2:font-bold prose-h2:mt-10 prose-p:text-slate-600 prose-li:text-slate-600 max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            Welcome to MediBridgeX. These Terms of Service ("Terms") govern your access to and use of the MediBridgeX website, API, interoperability engine, and related services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms.
          </p>

          <h2>1. Enterprise Agreements & BAA Primacy</h2>
          <p>
            If your organization has executed a separate Master Services Agreement (MSA) or a Business Associate Agreement (BAA) with MediBridgeX, the terms of those signed agreements will supersede these Terms in the event of a conflict. Specifically, the handling, processing, and safeguarding of all Protected Health Information (PHI) is governed <strong>exclusively</strong> by your BAA.
          </p>

          <h2>2. Not Medical Advice (Clinical Disclaimer)</h2>
          <p>
            <strong>MediBridgeX is purely a technological data transport and transformation layer.</strong> We are not a healthcare provider, medical professional, or clinical decision support system. The Services are designed to route and translate HL7, FHIR, and other healthcare data formats. MediBridgeX does not review the clinical accuracy of the data passing through our APIs. <strong>Healthcare providers, hospitals, and clinicians remain solely and completely responsible for all medical care, diagnoses, and clinical decisions made based on data routed through MediBridgeX.</strong>
          </p>

          <h2>3. Acceptable Use Policy (AUP)</h2>
          <p>By using MediBridgeX, you agree <strong>NOT</strong> to:</p>
          <ul className="space-y-2 my-4">
            <li>Reverse-engineer, decompile, or attempt to extract the source code or proprietary data transformation algorithms of the Services.</li>
            <li>Conduct unauthorized vulnerability scanning, penetration testing, or DDoS attacks against our APIs.</li>
            <li>Use the Services to transmit malicious code, viruses, or intentionally malformed payloads designed to disrupt the platform.</li>
            <li>Use the Services in any manner that violates applicable federal, state, or local laws, including HIPAA.</li>
          </ul>

          <h2>4. Intellectual Property & Data Ownership</h2>
          <ul className="space-y-2 my-4">
            <li><strong>MediBridgeX IP:</strong> MediBridgeX retains all rights, title, and interest in and to the platform, APIs, transformation engines, algorithms, and documentation.</li>
            <li><strong>Customer Data:</strong> You (and your patients) retain all rights, title, and ownership of your Customer Data (including PHI). MediBridgeX claims no ownership over the medical records routed through our platform.</li>
          </ul>

          <h2>5. Service Level Agreement (SLA) & Availability</h2>
          <p>
            We strive to ensure the Services are highly available (target 99.9% uptime). However, the Services may occasionally be unavailable due to planned maintenance, emergency security patches, or events outside our reasonable control (e.g., severe cloud provider outages). MediBridgeX is not liable for data delivery delays caused by external network failures or destination server unreachability.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p className="uppercase text-sm font-semibold tracking-wide">
            To the maximum extent permitted by law, MediBridgeX shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the services. In no event shall MediBridgeX's aggregate liability exceed the total amount paid by you to MediBridgeX in the twelve (12) months preceding the event giving rise to the claim.
          </p>

          <h2>7. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless MediBridgeX, its officers, and employees from any claims, damages, liabilities, and expenses (including attorney fees) arising from: (a) your violation of these Terms; (b) your violation of HIPAA or other privacy laws; or (c) any medical malpractice or clinical errors resulting from your use of the Services.
          </p>

          <h2>8. Termination and Data Extraction</h2>
          <p>Either party may terminate these Terms at any time for convenience or for cause. Upon termination or cancellation of your account:</p>
          <ul className="space-y-2 my-4">
            <li>You will have a <strong>thirty (30) day window</strong> to extract your historical data and logs via our APIs.</li>
            <li>After 30 days, MediBridgeX will securely and permanently delete your Customer Data and PHI from our active servers in compliance with HIPAA and your BAA.</li>
          </ul>

          <h2>9. Contact Information</h2>
          <p>
            For legal inquiries or notices regarding these Terms, please contact our legal department at:
          </p>
          <ul className="space-y-2 mt-4 list-none pl-0">
            <li><strong>Email:</strong> legal@medibridgex.io</li>
            <li><strong>Address:</strong> [Your Company Address]</li>
          </ul>
        </article>
      </div>

      <Footer />
    </main>
  );
}

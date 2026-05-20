import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 sm:px-12 max-w-4xl mx-auto">
        <header className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Last Updated: <span className="font-semibold text-slate-700">{lastUpdated}</span>
          </p>
        </header>

        <article className="prose prose-slate prose-h2:text-slate-800 prose-h2:font-bold prose-h2:mt-10 prose-p:text-slate-600 prose-li:text-slate-600 max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            Welcome to MediBridgeX. We are committed to protecting the privacy and security of your data. As a healthcare interoperability platform, we operate under the strictest standards of data protection, including HIPAA compliance. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (medibridgex.io) or use our application and services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information that identifies, relates to, describes, or could reasonably be linked, directly or indirectly, with a particular consumer, device, or organization.
          </p>
          <ul className="space-y-2 my-4">
            <li><strong>Account Information:</strong> Name, email address, job title, role, hospital/organization name, and password.</li>
            <li><strong>System & Usage Data:</strong> API keys, webhook endpoints, and metadata regarding the volume and routing of HL7 and FHIR messages.</li>
            <li><strong>Protected Health Information (PHI):</strong> As an interoperability platform, we process PHI (such as patient demographics, clinical records, and billing data) strictly on behalf of our clients. <strong>We only process this data as outlined in our Business Associate Agreements (BAA).</strong></li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect primarily to provide, maintain, and improve our interoperability services.</p>
          <ul className="space-y-2 my-4">
            <li><strong>To Provide Services:</strong> Routing HL7 messages, performing FHIR conversions, and authenticating user access.</li>
            <li><strong>For Security:</strong> Detecting and preventing unauthorized access, data breaches, or fraudulent activity.</li>
            <li><strong>Aggregated Telemetry (Non-PHI):</strong> We collect aggregated, anonymized telemetry data (e.g., message throughput rates, API latency) to improve our platform. This system data never contains PHI and cannot be reverse-engineered to identify individuals or organizations.</li>
          </ul>

          <h2>3. HIPAA & Healthcare Compliance (BAA)</h2>
          <p>For our healthcare clients in the United States, MediBridgeX acts as a <strong>Business Associate</strong> under the Health Insurance Portability and Accountability Act (HIPAA).</p>
          <ul className="space-y-2 my-4">
            <li>All processing of PHI is strictly governed by a mutually executed <strong>Business Associate Agreement (BAA)</strong>.</li>
            <li>MediBridgeX does not use PHI for marketing, advertising, or any purpose other than providing the interoperability services contracted by the covered entity.</li>
          </ul>

          <h2>4. AI and Machine Learning Policy</h2>
          <p>
            MediBridgeX <strong>does not</strong> use your Protected Health Information (PHI) to train, fine-tune, or develop artificial intelligence, large language models (LLMs), or machine learning algorithms without explicit, separate written consent and rigorous de-identification protocols.
          </p>

          <h2>5. Data Security, Encryption & Residency</h2>
          <p>The security of your data is our highest priority.</p>
          <ul className="space-y-2 my-4">
            <li><strong>Encryption:</strong> All data is encrypted <strong>in transit</strong> (using TLS 1.3+) and <strong>at rest</strong> (using AES-256).</li>
            <li><strong>Access Control:</strong> We employ strict Role-Based Access Control (RBAC) and comprehensive audit logging.</li>
            <li><strong>Data Residency:</strong> All data processed for United States clients remains exclusively within US-based, highly available data centers to ensure strict data sovereignty.</li>
          </ul>

          <h2>6. Incident Response & Breach Notification</h2>
          <p>
            In the highly unlikely event of a security incident or data breach, MediBridgeX commits to notifying your designated security contacts <strong>within 24 hours of discovery</strong>, in full compliance with the HIPAA Breach Notification Rule and our overarching Service Level Agreements (SLAs).
          </p>

          <h2>7. Sharing and Disclosure (Sub-processors)</h2>
          <p>
            We do not sell your personal information or PHI. We utilize enterprise-grade cloud infrastructure providers (e.g., AWS) to host our services. All sub-processors are contractually bound to protect your data and have signed a BAA with us. We maintain a public list of all active sub-processors and will notify clients 30 days prior to introducing any new sub-processor.
          </p>

          <h2>8. Vulnerability Disclosure</h2>
          <p>
            We take security seriously. If you are a security researcher and have discovered a vulnerability in our platform, please report it immediately to <code>security@medibridgex.io</code>. We provide safe harbor for responsible disclosure.
          </p>

          <h2>9. Your Data Rights</h2>
          <ul className="space-y-2 my-4">
            <li><strong>Account Users:</strong> You have the right to access, update, or delete your personal developer/admin account information.</li>
            <li><strong>Patient Records:</strong> If you are a patient seeking to access or delete your medical records, you must contact your healthcare provider (the Data Controller) directly. MediBridgeX cannot delete or modify patient records directly without authorization from the hospital.</li>
          </ul>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at:
          </p>
          <ul className="space-y-2 mt-4 list-none pl-0">
            <li><strong>Email:</strong> privacy@medibridgex.io</li>
            <li><strong>Address:</strong> [Your Company Address]</li>
          </ul>
        </article>
      </div>

      <Footer />
    </main>
  );
}

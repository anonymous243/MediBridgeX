import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FileBadge, Server, Bug, Activity } from "lucide-react";
import Link from "next/link";

export default function TrustCenterPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-widest uppercase border border-slate-200">
            Trust Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Security is our foundation.
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We understand that in healthcare, trust is paramount. Our Trust Center provides full transparency into our security posture, compliance frameworks, and system reliability.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <FileBadge className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Compliance Badges</h3>
              <p className="text-slate-600 mb-4">
                MediBridgeX is built to meet the most rigorous global standards. We undergo annual audits by independent third parties to maintain our certifications.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">SOC 2 Type II</span>
                <Link href="/hipaa" className="px-3 py-1 bg-slate-100 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors">HIPAA Compliant</Link>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">GDPR Ready</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">ISO 27001</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <Server className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Infrastructure Security</h3>
              <p className="text-slate-600">
                Our platform is hosted on top-tier cloud providers (AWS/GCP) within logically isolated Virtual Private Clouds (VPCs). We utilize strict network firewalls, WAFs, and automated DDoS protection to ensure your data remains secure from edge to database.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <Bug className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Vulnerability Management</h3>
              <p className="text-slate-600">
                Security is a continuous process. We perform automated static and dynamic application security testing (SAST/DAST) on every deployment. Additionally, we contract elite cybersecurity firms for bi-annual manual penetration testing.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Reliability & SLA</h3>
              <p className="text-slate-600 mb-4">
                Healthcare doesn't stop, and neither do we. We offer an enterprise-backed 99.99% uptime Service Level Agreement (SLA), supported by multi-region redundancy and automated disaster recovery protocols.
              </p>
              <Link href="/" className="text-sm font-bold text-slate-900 hover:text-[#9d174d] transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                View System Status
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ShieldCheck, Lock, Users, Activity } from "lucide-react";

export default function HipaaPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-widest uppercase border border-blue-200">
            Security & Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            HIPAA Compliance
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            MediBridgeX is designed from the ground up to secure Protected Health Information (PHI) and fully comply with the Health Insurance Portability and Accountability Act.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Business Associate Agreements (BAA)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We readily sign standard Business Associate Agreements with all Covered Entities. Our shared responsibility model ensures strict accountability for PHI across our entire infrastructure.
            </p>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <Lock className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Military-Grade Encryption</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We utilize enterprise Key Management Systems (KMS) with strict key rotation policies.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <Users className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Strict Access Controls</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We employ strict Role-Based Access Control (RBAC) and the principle of least privilege. All MediBridgeX personnel are required to use phishing-resistant MFA to access internal systems.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <Activity className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Immutable Audit Logging</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every interaction with PHI—whether read, write, or delete—is heavily logged. Audit trails are immutable, stored securely, and retained in accordance with federal compliance laws.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FileBadge, Server, Lock, Activity, ShieldCheck, Cpu } from "lucide-react";
import Link from "next/link";

export default function TrustCenterPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-gray-100">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold tracking-widest uppercase border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Trust Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Enterprise security for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              healthcare data.
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            In healthcare, trust is your most valuable asset. MediBridgeX is built from the ground up with military-grade encryption, decoupled infrastructure, and guaranteed 99.99% uptime to keep your PHI safe and flowing.
          </p>
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Pillar 1: Certifications */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                <FileBadge className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Compliance & Certifications</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                MediBridgeX operates under the most rigorous global standards. We act as your Business Associate (BA) and undergo annual third-party audits to validate our controls.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">SOC 2 Type II</span>
                <span className="px-4 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">HIPAA Compliant</span>
                <span className="px-4 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">BAA Available</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Reliability & RabbitMQ */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">99.99% Uptime & Resiliency</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Zero dropped messages. Our architecture utilizes <strong className="text-slate-900">RabbitMQ</strong> for highly durable, decoupled message queues. If a downstream hospital system goes offline, messages are safely queued and retried automatically.
              </p>
              <Link href="/docs" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2">
                Explore our architecture &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 3: Encryption */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Military-Grade Encryption</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                All PHI is encrypted both at rest and in transit. We enforce TLS 1.3 for all API communication and utilize AES-256-GCM encryption for database storage, complete with automated key rotation.
              </p>
            </div>
          </div>

          {/* Pillar 4: Edge Infrastructure */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <Server className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Edge Defense & HA</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Secured by Cloudflare at the edge, MediBridgeX is protected against DDoS attacks and malicious bots. Our core infrastructure runs on Multi-AZ High Availability databases to ensure seamless failovers.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Security Reporting */}
      <div className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Cpu className="w-10 h-10 text-slate-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Vulnerability Disclosure</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Security is an ongoing commitment. If you are a security researcher and believe you have found a vulnerability in the MediBridgeX platform, please report it to our security team. We take all reports seriously and act quickly.
          </p>
          <a href="mailto:security@medibridgex.com" className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 bg-slate-900">
            Report a Vulnerability
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WorkflowDiagram } from "./WorkflowDiagram";

/* ─────────────────────────────────────────
   Inline SVG icons (no lucide dependency)
───────────────────────────────────────── */
type IconProps = React.SVGAttributes<SVGElement> & { className?: string };

function IconShield({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconZap({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
function IconCode({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
function IconArrowRight({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
function IconHL7({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function IconExchange({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}
function IconCloud({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  );
}
function IconMonitor({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 21h8m-4-4v4" />
    </svg>
  );
}
function IconCheck({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const trustBadges = [
  { Icon: IconShield, title: "Secure by Design", sub: "HIPAA-ready architecture" },
  { Icon: IconZap, title: "Real-time Processing", sub: "High throughput & real-time" },
  { Icon: IconCode, title: "Developer First", sub: "APIs built for developers" },
];

const features = [
  {
    Icon: IconHL7,
    title: "HL7 Processing",
    desc: "Robust parsing and validation of HL7 v2 messages.",
    iconBg: "rgba(236, 72, 153, 0.15)", // pink glow
    iconColor: "#f472b6", // lighter pink
  },
  {
    Icon: IconExchange,
    title: "FHIR Conversion",
    desc: "Intelligent mapping to FHIR R4 resources and bundles.",
    iconBg: "rgba(59, 130, 246, 0.15)", // blue glow
    iconColor: "#60a5fa", // lighter blue
  },
  {
    Icon: IconCloud,
    title: "Integration APIs",
    desc: "RESTful APIs and webhooks for modern integrations.",
    iconBg: "rgba(168, 85, 247, 0.15)", // purple glow
    iconColor: "#c084fc", // lighter purple
  },
  {
    Icon: IconMonitor,
    title: "Monitoring & Alerts",
    desc: "Real-time monitoring, error tracking and smart alerts.",
    iconBg: "rgba(20, 184, 166, 0.15)", // teal glow
    iconColor: "#2dd4bf", // lighter teal
  },
];

const workflowSteps = [
  { label: "Healthcare\nSystems", tag: null, Icon: IconMonitor, color: "#f472b6" },
  { label: "Message\nReceiver", tag: "HL7", Icon: IconHL7, color: "#60a5fa" },
  { label: "Data\nProcessor", tag: null, Icon: IconCode, color: "#c084fc" },
  { label: "FHIR\nConverter", tag: "FHIR", Icon: IconExchange, color: "#2dd4bf" },
  { label: "APIs &\nApplications", tag: null, Icon: IconCloud, color: "#818cf8" },
];

const trustFooter = [
  { Icon: IconShield, label: "Secure" },
  { Icon: IconCloud, label: "Scalable" },
  { Icon: IconCheck, label: "Reliable" },
  { Icon: IconCode, label: "Standards-based" },
];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#030712]">
      {/* ── Immersive Glow Background ── */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none mix-blend-screen"
           style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(236,72,153,0.5) 40%, transparent 70%)' }}>
      </div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 pointer-events-none mix-blend-screen"
           style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.6) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 relative z-10">
        
        {/* ── Text block — centered ── */}
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 border border-slate-700/50 bg-slate-800/40 backdrop-blur-md"
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: "linear-gradient(135deg,#f472b6,#c084fc)", boxShadow: "0 0 10px rgba(236,72,153,0.5)" }}
            />
            <span
              className="text-[10px] font-bold tracking-widest uppercase text-slate-300"
            >
              FHIR-Native Interoperability Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[52px] font-extrabold leading-[1.1] text-white mb-6 tracking-tight">
            Modern Healthcare
            <br />
            Interoperability
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #f472b6, #c084fc)" }}>Simplified.</span>
          </h1>

          {/* Sub */}
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-[540px]">
            MediBridgeX connects legacy healthcare systems with modern
            applications using intelligent HL7 processing, FHIR conversion,
            and secure API infrastructure.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-4 mb-14">
            <Link 
              href="/auth/sign-up" 
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
              style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)" }}
            >
              Get Started
              <IconArrowRight className="w-4 h-4" />
            </Link>

            <Link href="/docs" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-slate-200 border border-slate-700 bg-slate-800/50 backdrop-blur-md hover:bg-slate-700/50 transition-colors">
              Explore Docs
              <IconCode className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges - Glassmorphism style */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
            {trustBadges.map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/50 rounded-2xl px-5 py-3 backdrop-blur-sm">
                <Icon className="w-6 h-6 flex-shrink-0" style={{ color: "#f472b6" } as React.CSSProperties} />
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-200">{title}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Diagram — below text, centered ── */}
          <div className="w-full flex justify-center mt-4">
            <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-700/50 backdrop-blur-xl shadow-2xl">
              <WorkflowDiagram />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES STRIP - Dark Glass
      ══════════════════════════════════════ */}
      <div className="border-t border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[15px] font-semibold text-slate-400 mb-10">
            Everything you need for seamless healthcare data interoperability
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map(({ Icon, title, desc, iconBg, iconColor }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  style={{ background: iconBg, border: `1px solid ${iconBg.replace('0.15', '0.3')}` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: iconColor } as React.CSSProperties}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200 mb-1">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col gap-6 items-stretch">

          {/* How it works - Dark Glass Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-700/50 shadow-2xl p-10 flex flex-col items-center relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none"></div>

            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl font-extrabold text-white mb-3">
                How MediBridgeX Works
              </h2>
              <p className="text-sm text-slate-400 max-w-[400px]">
                A seamless pipeline from legacy systems to modern FHIR applications
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap w-full relative z-10">
              {workflowSteps.map(({ label, tag, Icon, color }, idx) => (
                <div key={label} className="flex items-center gap-3 md:gap-5">
                  <div
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl p-5 w-[130px] min-h-[130px] bg-slate-800/80 border border-slate-700/60 shadow-lg transition-all hover:-translate-y-1 hover:border-slate-500/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  >
                    {tag && (
                      <span
                        className="text-[9px] font-bold rounded px-1.5 py-0.5 uppercase tracking-wider"
                        style={{
                          color: color,
                          background: `${color}1A`, // 10% opacity
                          border: `1px solid ${color}33`,
                        }}
                      >
                        {tag}
                      </span>
                    )}
                    <Icon className="w-9 h-9 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" style={{ color } as React.CSSProperties} />
                    <span className="text-[12px] font-semibold text-slate-300 text-center leading-tight whitespace-pre-line mt-1">
                      {label}
                    </span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <svg className="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM TRUST BAR
      ══════════════════════════════════════ */}
      <div className="pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase">Built for the future of healthcare</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {trustFooter.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-400">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
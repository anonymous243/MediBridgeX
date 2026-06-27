"use client";

import React from "react";
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
function IconCode({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
function IconArrowRight({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 21h8m-4-4v4" />
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
  { Icon: IconZap,    title: "Real-time Processing", sub: "High throughput & real-time" },
  { Icon: IconCode,   title: "Developer First",  sub: "APIs built for developers" },
];

const features = [
  {
    Icon: IconHL7,
    title: "HL7 Processing",
    desc: "Robust parsing and validation of HL7 v2 messages.",
    accent: "#ec4899",
    iconBg: "#fdf2f8",
  },
  {
    Icon: IconExchange,
    title: "FHIR Conversion",
    desc: "Intelligent mapping to FHIR R4 resources and bundles.",
    accent: "#a855f7",
    iconBg: "#faf5ff",
  },
  {
    Icon: IconCloud,
    title: "Integration APIs",
    desc: "RESTful APIs and webhooks for modern integrations.",
    accent: "#14b8a6",
    iconBg: "#f0fdfa",
  },
  {
    Icon: IconMonitor,
    title: "Monitoring & Alerts",
    desc: "Real-time monitoring, error tracking and smart alerts.",
    accent: "#6366f1",
    iconBg: "#eef2ff",
  },
];

const workflowSteps = [
  { label: "Healthcare\nSystems",  tag: null,   Icon: IconMonitor,  color: "#ec4899", bg: "#fdf2f8" },
  { label: "Message\nReceiver",    tag: "HL7",   Icon: IconHL7,       color: "#a855f7", bg: "#faf5ff" },
  { label: "Data\nProcessor",      tag: null,   Icon: IconCode,      color: "#6366f1", bg: "#eef2ff" },
  { label: "FHIR\nConverter",      tag: "FHIR", Icon: IconExchange,  color: "#14b8a6", bg: "#f0fdfa" },
  { label: "APIs &\nApplications", tag: null,   Icon: IconCloud,     color: "#0ea5e9", bg: "#f0f9ff" },
];

const trustFooter = [
  { Icon: IconShield, label: "Secure" },
  { Icon: IconCloud,  label: "Scalable" },
  { Icon: IconCheck,  label: "Reliable" },
  { Icon: IconCode,   label: "Standards-based" },
];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* ── Aurora / mesh background blobs ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* top-left pink blob */}
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-[0.12] blur-[90px]"
          style={{ background: "radial-gradient(circle, #ec4899 0%, #a855f7 60%, transparent 100%)" }}
        />
        {/* top-right teal blob */}
        <div
          className="absolute -top-20 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.10] blur-[80px]"
          style={{ background: "radial-gradient(circle, #14b8a6 0%, #6366f1 60%, transparent 100%)" }}
        />
        {/* bottom-center pink accent */}
        <div
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.07] blur-[70px]"
          style={{ background: "radial-gradient(ellipse, #a855f7 0%, #ec4899 70%, transparent 100%)" }}
        />
      </div>

      {/* ══════════════════════════════════════
          HERO — 2-column layout
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── LEFT: text + CTAs ── */}
          <div className="flex flex-col items-start text-left">

            {/* Shimmer badge */}
            <div
              className="relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 border overflow-hidden"
              style={{ borderColor: "#fbcfe8", background: "#fdf2f8" }}
            >
              {/* subtle shimmer sweep */}
              <span
                className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.12), transparent)",
                }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)", boxShadow: "0 0 8px rgba(236,72,153,0.5)" }}
              />
              <span className="text-[10px] font-bold tracking-widest uppercase relative" style={{ color: "#db2777" }}>
                FHIR-Native Interoperability Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[54px] font-extrabold leading-[1.08] text-gray-900 mb-5 tracking-tight">
              Modern Healthcare
              <br />
              Interoperability
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, #ec4899, #a855f7)" }}
              >
                Simplified.
              </span>
            </h1>

            {/* Sub */}
            <p className="text-[17px] text-gray-500 leading-relaxed mb-9 max-w-[460px]">
              MediBridgeX connects legacy healthcare systems with modern
              applications using intelligent HL7 processing, FHIR conversion,
              and secure API infrastructure.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 mb-10">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-[0_6px_24px_rgba(236,72,153,0.35)]"
                style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)", boxShadow: "0 4px 16px rgba(236,72,153,0.25)" }}
              >
                Get Started
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                Explore Docs
                <IconCode className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust badges — horizontal row */}
            <div className="flex flex-wrap items-center gap-6">
              {trustBadges.map(({ Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#fdf2f8" }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: "#ec4899" } as React.CSSProperties} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">{title}</p>
                    <p className="text-[11px] text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Workflow diagram floated in a styled card ── */}
          <div className="flex justify-center items-center">
            <div
              className="relative rounded-3xl p-[2px] shadow-[0_8px_48px_rgba(168,85,247,0.12)]"
              style={{
                background: "linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.3) 50%, rgba(20,184,166,0.2) 100%)",
              }}
            >
              <div className="rounded-[22px] bg-white/95 backdrop-blur-sm p-5">
                <WorkflowDiagram />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES STRIP — gradient-border cards
      ══════════════════════════════════════ */}
      <div className="border-t border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[15px] font-semibold text-gray-500 mb-10">
            Everything you need for seamless healthcare data interoperability
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ Icon, title, desc, accent, iconBg }) => (
              <div
                key={title}
                className="relative group rounded-[20px] p-[1.5px] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                style={{
                  background: `linear-gradient(135deg, ${accent}55, ${accent}22, transparent)`,
                }}
              >
                <div className="rounded-[18.5px] bg-white px-5 py-6 h-full flex flex-col gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: iconBg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: accent } as React.CSSProperties} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 mb-1">{title}</p>
                    <p className="text-[12px] text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HOW IT WORKS — gradient timeline
      ══════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h2 className="text-[30px] font-extrabold text-gray-900 mb-2">How MediBridgeX Works</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            A seamless pipeline from legacy systems to modern FHIR applications
          </p>
        </div>

        <div className="flex items-stretch justify-center gap-0 overflow-x-auto pb-2">
          {workflowSteps.map(({ label, tag, Icon, color, bg }, idx) => (
            <div key={label} className="flex items-center">
              {/* Step card */}
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl px-5 py-6 w-[130px] min-h-[130px] border border-gray-100 bg-white shadow-sm hover:-translate-y-1 transition-transform duration-200">
                {tag && (
                  <span
                    className="text-[9px] font-extrabold rounded-md px-1.5 py-0.5 uppercase tracking-wider"
                    style={{ color, background: bg, border: `1px solid ${color}33` }}
                  >
                    {tag}
                  </span>
                )}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color } as React.CSSProperties} />
                </div>
                <span className="text-[11px] font-semibold text-gray-600 text-center leading-snug whitespace-pre-line">
                  {label}
                </span>
              </div>

              {/* Gradient connector arrow */}
              {idx < workflowSteps.length - 1 && (
                <div className="flex items-center px-1 flex-shrink-0">
                  <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                    <defs>
                      <linearGradient id={`arrow-grad-${idx}`} x1="0" y1="0" x2="36" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={workflowSteps[idx].color} />
                        <stop offset="100%" stopColor={workflowSteps[idx + 1].color} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 8 H28 M22 2 L34 8 L22 14"
                      stroke={`url(#arrow-grad-${idx})`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          FOOTER CTA — gradient wash
      ══════════════════════════════════════ */}
      <div
        className="relative overflow-hidden mx-6 mb-16 rounded-3xl text-center py-16 px-6"
        style={{
          background: "linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #f0fdfa 100%)",
          border: "1px solid rgba(236,72,153,0.12)",
        }}
      >
        {/* decorative blobs inside the CTA card */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-20 blur-[60px]"
            style={{ background: "radial-gradient(circle, #ec4899, transparent)" }}
          />
          <div
            className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full opacity-20 blur-[60px]"
            style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }}
          />
        </div>

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-3">Get Started Today</p>
          <h2 className="text-[34px] font-extrabold text-gray-900 leading-tight mb-4">
            Ready to bridge your
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(to right, #ec4899, #a855f7)" }}
            >
              healthcare data?
            </span>
          </h2>
          <p className="text-[15px] text-gray-500 mb-8 max-w-[420px] mx-auto leading-relaxed">
            Join healthcare teams already using MediBridgeX to modernize
            their data infrastructure — no complexity required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_8px_28px_rgba(236,72,153,0.35)]"
              style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)", boxShadow: "0 4px 20px rgba(236,72,153,0.25)" }}
            >
              Start for Free
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM TRUST BAR
      ══════════════════════════════════════ */}
      <div className="pb-10 pt-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Built for the future of healthcare</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {trustFooter.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-gray-400">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
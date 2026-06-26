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
function IconLock({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}
function IconMail({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
    iconBg: "#fdf2f8",
    iconColor: "#ec4899",
  },
  {
    Icon: IconExchange,
    title: "FHIR Conversion",
    desc: "Intelligent mapping to FHIR R4 resources and bundles.",
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
  },
  {
    Icon: IconCloud,
    title: "Integration APIs",
    desc: "RESTful APIs and webhooks for modern integrations.",
    iconBg: "#faf5ff",
    iconColor: "#a855f7",
  },
  {
    Icon: IconMonitor,
    title: "Monitoring & Alerts",
    desc: "Real-time monitoring, error tracking and smart alerts.",
    iconBg: "#f0fdfa",
    iconColor: "#14b8a6",
  },
];

const workflowSteps = [
  { label: "Healthcare\nSystems", tag: null, Icon: IconMonitor, bg: "#fdf2f8", color: "#ec4899" },
  { label: "Message\nReceiver", tag: "HL7", Icon: IconHL7, bg: "#eff6ff", color: "#3b82f6" },
  { label: "Data\nProcessor", tag: null, Icon: IconCode, bg: "#faf5ff", color: "#a855f7" },
  { label: "FHIR\nConverter", tag: "FHIR", Icon: IconExchange, bg: "#f0fdfa", color: "#14b8a6" },
  { label: "APIs &\nApplications", tag: null, Icon: IconCloud, bg: "#eef2ff", color: "#6366f1" },
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden">

      {/* ══════════════════════════════════════
          HERO — text centered, diagram below
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">

        {/* ── Text block — centered ── */}
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 border"
            style={{ borderColor: "#fbcfe8", background: "#fdf2f8" }}
          >
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#ec4899,#a855f7)" }}
            />
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "#db2777" }}
            >
              FHIR-Native Interoperability Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[52px] font-extrabold leading-[1.1] text-gray-900 mb-4">
            Modern Healthcare
            <br />
            Interoperability
            <br />
            <span style={{ color: "#ec4899" }}>Simplified.</span>
          </h1>

          {/* Sub */}
          <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-[480px]">
            MediBridgeX connects legacy healthcare systems with modern
            applications using intelligent HL7 processing, FHIR conversion,
            and secure API infrastructure.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 mb-10">

            <Link href="/docs" className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
              Explore Docs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-8 mb-14">
            {trustBadges.map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2">
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: "#ec4899" } as React.CSSProperties} />
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Diagram — below text, centered ── */}
          <div className="w-full flex justify-center">
            <WorkflowDiagram />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES STRIP
      ══════════════════════════════════════ */}
      <div className="border-t border-b border-gray-100 bg-white/30 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[15px] font-semibold text-gray-800 mb-8">
            Everything you need for seamless healthcare data interoperability
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map(({ Icon, title, desc, iconBg, iconColor }) => (
              <div key={title} className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: iconBg }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: iconColor } as React.CSSProperties}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{title}</p>
                  <p className="text-xs text-gray-500 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HOW IT WORKS + WAITLIST
      ══════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-6 items-stretch">

          {/* How it works */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-900 mb-5">
              How MediBridgeX Works
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {workflowSteps.map(({ label, tag, Icon, bg, color }, idx) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="flex flex-col items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 w-[72px] min-h-[72px]"
                    style={{ background: bg }}
                  >
                    {tag && (
                      <span
                        className="text-[8px] font-bold rounded px-1 py-0.5 mb-0.5"
                        style={{
                          color: tag === "HL7" ? "#db2777" : "#0d9488",
                          background: tag === "HL7" ? "#fce7f3" : "#ccfbf1",
                        }}
                      >
                        {tag}
                      </span>
                    )}
                    <Icon className="w-5 h-5" style={{ color } as React.CSSProperties} />
                    <span className="text-[8px] text-gray-600 text-center leading-tight whitespace-pre-line">
                      {label}
                    </span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-400 font-medium">Built for the future of healthcare</p>
          <div className="flex items-center gap-10">
            {trustFooter.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-gray-400">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
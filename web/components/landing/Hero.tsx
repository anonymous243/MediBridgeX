"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { HealthcareNetwork } from "./HealthcareNetwork";
import { StorytellingJourney } from "./StorytellingJourney";

/* ─── Floating Healthcare Artifacts ─── */
function FloatingArtifacts() {
  const items = [
    { emoji: "🧬", x: "8%", y: "20%", delay: 0, size: 28 },
    { emoji: "💉", x: "88%", y: "15%", delay: 1.2, size: 22 },
    { emoji: "📋", x: "5%", y: "70%", delay: 0.6, size: 20 },
    { emoji: "🫀", x: "92%", y: "65%", delay: 1.8, size: 24 },
    { emoji: "🔒", x: "12%", y: "45%", delay: 2.4, size: 18 },
    { emoji: "📡", x: "85%", y: "40%", delay: 0.3, size: 20 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.12]"
          style={{ left: item.x, top: item.y, fontSize: item.size }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6 + i,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── ECG Pulse Line ─── */
function ECGPulse() {
  return (
    <motion.svg
      viewBox="0 0 400 40"
      className="w-full max-w-md h-8 opacity-20"
      aria-hidden
    >
      <motion.path
        d="M0,20 L80,20 L90,20 L100,5 L110,35 L120,10 L130,30 L140,20 L200,20 L210,20 L220,5 L230,35 L240,10 L250,30 L260,20 L320,20 L330,20 L340,5 L350,35 L360,10 L370,30 L380,20 L400,20"
        fill="none"
        stroke="url(#ecgGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />
      <defs>
        <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

/* ─── Trust Logos ─── */
const trustItems = [
  { icon: "🔐", label: "HIPAA Compliant" },
  { icon: "🛡️", label: "SOC 2 Ready" },
  { icon: "⚡", label: "99.99% Uptime" },
  { icon: "🌐", label: "HL7 & FHIR R4" },
  { icon: "🏥", label: "Enterprise Grade" },
];

/* ─── Feature Capabilities ─── */
const capabilities = [
  {
    icon: "📨",
    title: "HL7 Message Processing",
    desc: "Parse, validate, and transform HL7 v2.x messages with intelligent field mapping.",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
  {
    icon: "🔄",
    title: "FHIR R4 Conversion",
    desc: "Automatic transformation to FHIR R4 resources with full compliance validation.",
    color: "#a855f7",
    bg: "#faf5ff",
  },
  {
    icon: "🔌",
    title: "Integration APIs",
    desc: "RESTful APIs, webhooks, and event streams for seamless system integration.",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    icon: "📊",
    title: "Real-Time Monitoring",
    desc: "Live dashboards, alerting, and comprehensive audit trails for full visibility.",
    color: "#14b8a6",
    bg: "#f0fdfa",
  },
  {
    icon: "🤖",
    title: "AI-Powered Mapping",
    desc: "Machine learning engine automatically maps fields between incompatible schemas.",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: "🔒",
    title: "Security & Compliance",
    desc: "End-to-end encryption, HIPAA compliance, and cryptographic audit logging.",
    color: "#6366f1",
    bg: "#eef2ff",
  },
];

/* ─── Capability Card ─── */
function CapabilityCard({ cap, index }: { cap: typeof capabilities[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 cursor-default overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {/* Hover gradient border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${cap.color}15, transparent)` }}
      />
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform group-hover:scale-110 duration-300"
          style={{ background: cap.bg }}
        >
          {cap.icon}
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{cap.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN HERO EXPORT
══════════════════════════════════════ */
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0.65, 0.95], [1, 0.4]);
  const heroScale = useTransform(scrollYProgress, [0.65, 0.95], [1, 0.98]);

  const capRef = useRef<HTMLDivElement>(null);
  const capInView = useInView(capRef, { once: true, margin: "-80px" });

  return (
    <section className="relative">

      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #fdf2f8 70%, #f0fdfa 100%)",
        }}
      >
        {/* Soft background blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-40 blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -top-20 -right-32 w-[500px] h-[500px] rounded-full opacity-30 blur-[90px]"
            style={{ background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[80px]"
            style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)" }}
          />
        </div>

        <FloatingArtifacts />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-8"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 border backdrop-blur-sm"
              style={{ borderColor: "#fbcfe8", background: "rgba(253,242,248,0.8)" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-pink-500 to-purple-500" />
              </span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-pink-600">
                Next-Gen Healthcare Interoperability
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h1 className="text-5xl md:text-[64px] font-extrabold leading-[1.08] text-gray-900 tracking-tight">
              The Intelligent
              <br />
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: "linear-gradient(135deg, #ec4899 0%, #a855f7 40%, #14b8a6 100%)"
              }}>
                Digital Backbone
              </span>
              <br />
              <span className="text-gray-400 text-4xl md:text-5xl font-bold">of Healthcare</span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            className="text-center text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            MediBridgeX connects every hospital, laboratory, pharmacy, and clinic
            through secure, AI-powered HL7 and FHIR interoperability — transforming
            fragmented systems into a unified healthcare ecosystem.
          </motion.p>

          {/* ECG Line */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ECGPulse />
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/auth/sign-up"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(236,72,153,0.4)]"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
                boxShadow: "0 4px 20px rgba(236,72,153,0.25)",
              }}
            >
              Start Building
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-gray-700 border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-gray-300 transition-all duration-300 shadow-sm"
            >
              View Documentation
            </Link>
          </motion.div>

          {/* Trust Row */}
          <motion.div
            className="flex items-center justify-center flex-wrap gap-6 mb-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {trustItems.map(t => (
              <div key={t.label} className="flex items-center gap-1.5 text-gray-400">
                <span className="text-sm">{t.icon}</span>
                <span className="text-[11px] font-medium">{t.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Interactive Healthcare Network */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Hover to explore the connected ecosystem
            </p>
            <HealthcareNetwork />
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 2 — CAPABILITIES GRID
      ══════════════════════════════════════ */}
      <div ref={capRef} className="bg-white py-20 md:py-28 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={capInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-pink-500 mb-3">Platform Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Everything you need for
              <br />
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: "linear-gradient(to right, #ec4899, #a855f7, #14b8a6)"
              }}>
                seamless interoperability
              </span>
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              From legacy HL7 processing to modern FHIR APIs, MediBridgeX provides the complete toolkit for healthcare data exchange.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap, i) => (
              <CapabilityCard key={cap.title} cap={cap} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 3 — INTERACTIVE JOURNEY
      ══════════════════════════════════════ */}
      <div
        className="relative"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 30%, #fdf2f8 60%, #f0fdfa 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-4">
          <div className="text-center mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-purple-500 mb-3">The Journey</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              From Fragmented to Unified
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
              See how MediBridgeX transforms disconnected healthcare systems into an intelligent, connected ecosystem.
            </p>
          </div>
        </div>
        <StorytellingJourney />
      </div>

      {/* ══════════════════════════════════════
          SECTION 4 — FOOTER CTA
      ══════════════════════════════════════ */}
      <div
        className="relative overflow-hidden mx-6 my-16 rounded-3xl text-center py-20 px-6"
        style={{
          background: "linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #f0fdfa 100%)",
          border: "1px solid rgba(236,72,153,0.12)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-20 blur-[60px]"
            style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full opacity-20 blur-[60px]"
            style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }} />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-4">Get Started Today</p>
          <h2 className="text-[36px] font-extrabold text-gray-900 leading-tight mb-5">
            Ready to bridge your
            <br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(to right, #ec4899, #a855f7)" }}>
              healthcare data?
            </span>
          </h2>
          <p className="text-[15px] text-gray-500 mb-10 leading-relaxed">
            Join healthcare teams already using MediBridgeX to modernize their data infrastructure — no complexity required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_8px_28px_rgba(236,72,153,0.35)]"
              style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)", boxShadow: "0 4px 20px rgba(236,72,153,0.25)" }}
            >
              Start for Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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

      {/* Bottom trust bar */}
      <div className="pb-16 pt-2">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500 font-medium">Built for the future of healthcare</p>
          <div className="flex items-center gap-10">
            {[
              { icon: "🔒", label: "Secure" },
              { icon: "☁️", label: "Scalable" },
              { icon: "✅", label: "Reliable" },
              { icon: "📐", label: "Standards-based" },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-1.5 text-gray-600">
                <span className="text-sm">{t.icon}</span>
                <span className="text-xs font-semibold">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
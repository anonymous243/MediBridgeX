"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Story Step Data ─── */
interface StoryStep {
  phase: string;
  phaseColor: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  stats: { label: string; value: string }[];
}

/* ─── Animated HL7 Stream ─── */
function HL7Stream() {
  const lines = [
    "MSH|^~\\&|EPIC|HOSPITAL|MBRX|",
    "PID|1||MRN-4829||DOE^JANE|",
    "OBR|1|ORD-001||CBC^COMPLETE|",
    "OBX|1|NM|WBC||7.2|10*3/uL|",
  ];
  return (
    <div className="bg-slate-900 rounded-2xl p-5 font-mono text-[11px] overflow-hidden border border-slate-700/50 shadow-2xl">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="text-slate-500 text-[9px] ml-2">hl7-message-stream.log</span>
      </div>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.3, duration: 0.5 }}
          className="text-emerald-400/90 mb-1 leading-relaxed"
        >
          <span className="text-slate-600 mr-2">{String(i + 1).padStart(2, "0")}</span>
          {line}
        </motion.div>
      ))}
      <motion.div
        className="h-px bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 mt-3 mb-2"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{ transformOrigin: "left" }}
      />
      <motion.p
        className="text-pink-400 text-[10px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        ✓ Message validated • Converting to FHIR R4...
      </motion.p>
    </div>
  );
}

/* ─── FHIR Resource Card ─── */
function FHIRResource() {
  const json = `{
  "resourceType": "Patient",
  "id": "mbrx-4829",
  "name": [{
    "family": "Doe",
    "given": ["Jane"]
  }],
  "identifier": [{
    "system": "urn:oid:2.16.840",
    "value": "MRN-4829"
  }]
}`;
  return (
    <div className="bg-white rounded-2xl p-5 font-mono text-[11px] border border-gray-200 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">FHIR R4 Resource</span>
        </div>
        <span className="text-[9px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Patient</span>
      </div>
      <pre className="text-slate-700 leading-relaxed whitespace-pre-wrap">
        {json.split("\n").map((line, i) => (
          <motion.span
            key={i}
            className="block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {line.includes('"') ? (
              <>
                {line.split(/(".*?")/).map((part, pi) =>
                  part.startsWith('"') ? (
                    <span key={pi} className={part.includes(":") ? "text-blue-600" : "text-amber-600"}>{part}</span>
                  ) : (
                    <span key={pi}>{part}</span>
                  )
                )}
              </>
            ) : (
              line
            )}
          </motion.span>
        ))}
      </pre>
    </div>
  );
}

/* ─── Analytics Dashboard Mini ─── */
function AnalyticsDash() {
  const bars = [65, 82, 45, 91, 73, 88, 56, 94, 70, 85, 60, 78];
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] font-bold text-gray-900">Real-Time Analytics</p>
          <p className="text-[9px] text-gray-400">Message throughput (24h)</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-semibold text-emerald-600">Live</span>
        </div>
      </div>
      <div className="flex items-end gap-1 h-16">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              background: `linear-gradient(to top, #ec4899, #a855f7)`,
            }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-3 text-[9px] text-gray-400">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
        {[
          { label: "Processed", value: "12.4K", color: "text-pink-600" },
          { label: "Success Rate", value: "99.7%", color: "text-emerald-600" },
          { label: "Avg Latency", value: "23ms", color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Connected Ecosystem Visual ─── */
function EcosystemVisual() {
  const entities = [
    { emoji: "🏥", label: "Hospital", x: 50, y: 15 },
    { emoji: "🔬", label: "Lab", x: 15, y: 45 },
    { emoji: "💊", label: "Pharmacy", x: 85, y: 45 },
    { emoji: "🩺", label: "Clinic", x: 25, y: 80 },
    { emoji: "🛡️", label: "Insurance", x: 75, y: 80 },
  ];
  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Lines from center to each entity */}
        {entities.map((e, i) => (
          <motion.line
            key={i}
            x1={50} y1={50} x2={e.x} y2={e.y}
            stroke="url(#connGrad)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
          />
        ))}
        {/* Center hub */}
        <circle cx={50} cy={50} r={8} fill="white" stroke="#ec4899" strokeWidth="0.5" />
        <text x={50} y={50} textAnchor="middle" dominantBaseline="central" fontSize="5">⚡</text>
        <text x={50} y={60} textAnchor="middle" fontSize="2" fontWeight="bold" fill="#ec4899">MediBridgeX</text>
        {/* Entity nodes */}
        {entities.map((e, i) => (
          <g key={i}>
            <motion.circle
              cx={e.x} cy={e.y} r={5}
              fill="white" stroke="#e2e8f0" strokeWidth="0.4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 + 0.5, type: "spring" }}
              style={{ transformOrigin: `${e.x}px ${e.y}px` }}
            />
            <text x={e.x} y={e.y} textAnchor="middle" dominantBaseline="central" fontSize="3.5">{e.emoji}</text>
            <text x={e.x} y={e.y + 7.5} textAnchor="middle" fontSize="1.8" fill="#64748b" fontWeight="500">{e.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const STEPS: StoryStep[] = [
  {
    phase: "The Challenge",
    phaseColor: "#ef4444",
    title: "Fragmented Healthcare Systems",
    description: "Patient data is trapped in isolated silos. Hospitals, labs, pharmacies, and clinics use incompatible systems — creating delays, errors, and disconnected care that impacts patient outcomes.",
    visual: <HL7Stream />,
    stats: [
      { label: "Systems Disconnected", value: "86%" },
      { label: "Data Entry Duplicated", value: "3.2x" },
      { label: "Avg Integration Time", value: "18 mo" },
    ],
  },
  {
    phase: "The Connection",
    phaseColor: "#a855f7",
    title: "Seamless Interoperability",
    description: "MediBridgeX securely bridges every healthcare system — converting legacy HL7 messages to modern FHIR R4 resources in real-time, creating a unified health information exchange.",
    visual: <EcosystemVisual />,
    stats: [
      { label: "Systems Connected", value: "100%" },
      { label: "FHIR Compliance", value: "R4" },
      { label: "Setup Time", value: "< 1 hr" },
    ],
  },
  {
    phase: "The Intelligence",
    phaseColor: "#3b82f6",
    title: "AI-Powered Transformation",
    description: "Intelligent mapping engine automatically transforms, validates, and routes healthcare data. Smart analytics provide real-time visibility into message flows and system health.",
    visual: <FHIRResource />,
    stats: [
      { label: "Auto-Mapped Fields", value: "97%" },
      { label: "Validation Accuracy", value: "99.9%" },
      { label: "Processing Speed", value: "< 50ms" },
    ],
  },
  {
    phase: "The Future",
    phaseColor: "#14b8a6",
    title: "Unified Healthcare Ecosystem",
    description: "A single, intelligent backbone connecting hospitals, clinics, labs, pharmacies, insurers, and government systems — enabling coordinated care at unprecedented scale.",
    visual: <AnalyticsDash />,
    stats: [
      { label: "Uptime SLA", value: "99.99%" },
      { label: "Messages / Day", value: "10M+" },
      { label: "HIPAA Certified", value: "✓" },
    ],
  },
];

/* ─── Single Story Section ─── */
function StorySection({ step, index }: { step: StoryStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-16`}>
        {/* Text Side */}
        <motion.div
          className="flex-1 max-w-lg"
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 border"
            style={{ borderColor: `${step.phaseColor}30`, background: `${step.phaseColor}08` }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: step.phaseColor }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.phaseColor }}>
              {step.phase}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {step.title}
          </h2>
          <p className="text-base text-gray-500 leading-relaxed mb-8">
            {step.description}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {step.stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <p className="text-lg font-bold" style={{ color: step.phaseColor }}>{s.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visual Side */}
        <motion.div
          className="flex-1 max-w-md w-full"
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          {step.visual}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export function StorytellingJourney() {
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
        style={{ background: "linear-gradient(to bottom, transparent, #e2e8f0, #e2e8f0, transparent)" }}
      />
      {STEPS.map((step, i) => (
        <StorySection key={step.phase} step={step} index={i} />
      ))}
    </div>
  );
}

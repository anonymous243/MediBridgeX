"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─── Story Step Data ─── */
interface StoryStep {
  phase: string;
  phaseColor: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  stats: { label: string; value: string }[];
}

/* ─── 1. The Challenge: HL7 Parser Gate & Segment Splitter ─── */
function HL7ParserVisual() {
  const [activeStep, setActiveStep] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const segments = [
    { label: "MSH", desc: "Message Header (Sending Application, Facility, Timestamp)" },
    { label: "PID", desc: "Patient Identification (Patient Name, DOB, MRN)" },
    { label: "PV1", desc: "Patient Visit (Admission Status, Assigned Location, Attending)" },
    { label: "OBX", desc: "Observation Result (Lab Values, Units, Reference Range)" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[4/3]">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[10px] font-mono text-slate-500">legacy_hl7_stream.sh</span>
      </div>

      {/* Legacy HL7 raw log */}
      <div className="font-mono text-xs space-y-2 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-850">
        <div className="text-slate-600 border-b border-slate-900 pb-2 mb-2 flex justify-between text-[10px]">
          <span>INPUT STREAM: PORT 5001</span>
          <span className="text-pink-500 animate-pulse">● RAW_RECEIVING</span>
        </div>
        {[
          "MSH|^~\\&|EPIC|HOSPITAL|MBRX|202606272144||ADT^A08|",
          "PID|1||MRN-9204||SMITH^JOHN^A||19841112|M|",
          "PV1|1|O|OP-CLINIC|||||",
          "OBX|1|NM|WBC||7.2|10*3/uL|4.0-11.0|N|",
        ].map((line, idx) => (
          <div
            key={idx}
            className={`transition-colors duration-300 px-2.5 py-1 rounded ${
              activeStep === idx
                ? "bg-pink-500/10 text-pink-400 font-semibold border-l-2 border-pink-500"
                : "text-slate-400"
            }`}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Split/Parser interface */}
      <div className="mt-4 bg-slate-950/60 border border-slate-850 rounded-2xl p-5 font-mono text-xs">
        <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Parsing Segment details</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <span className="bg-pink-500 text-white font-bold px-2 py-0.5 rounded text-xs">
                {segments[activeStep].label}
              </span>
              <span className="text-slate-300 font-bold">Segment Detected</span>
            </div>
            <p className="text-slate-400 mt-2 text-xs leading-relaxed">
              {segments[activeStep].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── 2. The Connection: Interactive Mapping Stream ─── */
function InteropStreamVisual() {
  const [activeSegment, setActiveSegment] = useState<"hl7" | "mbrx" | "fhir">("hl7");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSegment((s) => (s === "hl7" ? "mbrx" : s === "mbrx" ? "fhir" : "hl7"));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[4/3]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Data Exchange Pipe</span>
        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Active</span>
      </div>

      {/* Flow Path Visualization */}
      <div className="flex items-center justify-between relative py-8">
        {/* Horizontal Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-gray-100 rounded z-0" />

        {/* Highlighted active path */}
        <motion.div
          className="absolute left-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 rounded z-0"
          initial={{ right: "100%" }}
          animate={{
            right: activeSegment === "hl7" ? "70%" : activeSegment === "mbrx" ? "35%" : "0%",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Node 1: Legacy HL7 Source */}
        <div className="flex flex-col items-center gap-2.5 relative z-10">
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg border transition-all duration-300 ${
              activeSegment === "hl7"
                ? "bg-pink-500 border-pink-600 text-white scale-110 shadow-pink-500/20"
                : "bg-white border-gray-200 text-gray-400"
            }`}
          >
            📨
          </motion.div>
          <span className="text-xs font-bold text-gray-500 font-mono">Legacy HL7</span>
        </div>

        {/* Node 2: MediBridgeX Core */}
        <div className="flex flex-col items-center gap-2.5 relative z-10">
          <motion.div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-lg border transition-all duration-300 ${
              activeSegment === "mbrx"
                ? "bg-purple-600 border-purple-700 text-white scale-110 shadow-purple-500/20"
                : "bg-white border-gray-200 text-gray-400"
            }`}
          >
            ⚡
          </motion.div>
          <span className="text-xs font-bold text-gray-500 font-mono">MediBridgeX</span>
        </div>

        {/* Node 3: FHIR Standard Destination */}
        <div className="flex flex-col items-center gap-2.5 relative z-10">
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg border transition-all duration-300 ${
              activeSegment === "fhir"
                ? "bg-teal-500 border-teal-600 text-white scale-110 shadow-teal-500/20"
                : "bg-white border-gray-200 text-gray-400"
            }`}
          >
            🔓
          </motion.div>
          <span className="text-xs font-bold text-gray-500 font-mono">FHIR API</span>
        </div>
      </div>

      {/* Info Message box */}
      <div className="mt-4 bg-gray-50 border border-gray-100 rounded-2xl p-5">
        <AnimatePresence mode="wait">
          {activeSegment === "hl7" && (
            <motion.div
              key="hl7"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-xs text-gray-600 leading-relaxed"
            >
              <strong>1. Receiving Packets:</strong> Inbound HL7 ADT message containing clinical segments was pushed to the router endpoint.
            </motion.div>
          )}
          {activeSegment === "mbrx" && (
            <motion.div
              key="mbrx"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-xs text-gray-600 leading-relaxed"
            >
              <strong>2. Schema Mapping:</strong> MediBridgeX parses individual HL7 segments, validates data structure, and maps schemas dynamically.
            </motion.div>
          )}
          {activeSegment === "fhir" && (
            <motion.div
              key="fhir"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-xs text-gray-600 leading-relaxed"
            >
              <strong>3. Resource Delivery:</strong> Standardized FHIR Patient resource ready to be loaded by patient-facing apps or doctor interfaces.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── 3. The Intelligence: Terminology Mapping & Validation ─── */
function TerminologyMapperVisual() {
  const [currentMapIdx, setCurrentMapIdx] = useState(0);

  const mappings = [
    { source: "Coughing & SOB", target: "R06.02 (Dyspnea / Shortness of Breath)", code: "ICD-10", conf: "99.8%" },
    { source: "Complete Blood Count", target: "58410-2 (CBC Panel)", code: "LOINC", conf: "99.2%" },
    { source: "Acetaminophen 325mg", target: "313782 (Acetaminophen Oral Tablet)", code: "RxNorm", conf: "99.9%" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMapIdx((i) => (i + 1) % mappings.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const current = mappings[currentMapIdx];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[4/3]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-bold">AI Mapping Engine</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">mapping_matrix.conf</span>
      </div>

      {/* Input / Target Map blocks */}
      <div className="space-y-4 my-auto relative">
        {/* Source Text Bubble */}
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Unstructured Input</span>
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-sm font-semibold text-slate-200 mt-1.5 flex justify-between items-center">
            <span>"{current.source}"</span>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-mono">Raw Text</span>
          </div>
        </div>

        {/* Connecting scanner beam */}
        <div className="h-8 flex items-center justify-center relative">
          <div className="w-0.5 h-full bg-purple-500/40 relative">
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-4 h-1 bg-purple-500 shadow-[0_0_10px_#a855f7] rounded-full"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Standardized Output Bubble */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Standardized Terminology</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Confidence: {current.conf}
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-sm font-mono mt-1.5 flex justify-between items-center text-teal-400">
            <span>{current.target}</span>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-purple-400 font-bold uppercase">
              {current.code}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 4. The Future: Real-Time Stream Analytics ─── */
function DashboardVisual() {
  const [dataPoints, setDataPoints] = useState<number[]>([45, 52, 49, 62, 58, 70, 64, 76, 70, 85, 80, 94]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDataPoints((prev) => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const change = Math.floor(Math.random() * 15) - 7;
        const bounded = Math.max(30, Math.min(100, last + change));
        next.push(bounded);
        return next;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[4/3]">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
        <div>
          <p className="text-sm font-bold text-gray-900">Dynamic Metrics Console</p>
          <p className="text-xs text-gray-400">Live operational data flow</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live Stream</span>
        </div>
      </div>

      {/* Dynamic Graph Visual */}
      <div className="h-32 flex items-end gap-2 mt-4 relative">
        {dataPoints.map((h, idx) => (
          <motion.div
            key={idx}
            className="flex-1 rounded-t bg-gradient-to-t from-pink-500 to-purple-600"
            animate={{ height: `${h}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-100">
        {[
          { label: "Active Nodes", value: "10 / 10", color: "text-slate-900" },
          { label: "Transit Time", value: "14ms", color: "text-teal-600" },
          { label: "Delivery SLA", value: "99.998%", color: "text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className={`text-base font-extrabold ${stat.color} tracking-tight`}>{stat.value}</p>
            <p className="text-[10px] text-gray-400 uppercase mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEPS: StoryStep[] = [
  {
    phase: "The Challenge",
    phaseColor: "#ec4899",
    title: "Fragmented Healthcare Silos",
    description: "Clinical patient data is trapped in obsolete message formats (HL7 v2.x, raw lab output, paper charts) and incompatible software systems. This blocks collaboration, delays crucial emergency treatments, and increases entry errors.",
    visual: <HL7ParserVisual />,
    stats: [
      { label: "Siloed Health Systems", value: "86%" },
      { label: "Duplicate Data Entry", value: "3.2x" },
      { label: "Average Setup Delay", value: "14 Mo" },
    ],
  },
  {
    phase: "The Connection",
    phaseColor: "#a855f7",
    title: "Securing the Pipeline",
    description: "MediBridgeX routes clinical data in real-time. Incoming legacy message packets are intercepted, safely mapped, and output as queryable HL7 and FHIR resources through unified API endpoints.",
    visual: <InteropStreamVisual />,
    stats: [
      { label: "Pipeline Connectivity", value: "100%" },
      { label: "FHIR standard compliance", value: "R4" },
      { label: "Secure Protocols", value: "TLS 1.3" },
    ],
  },
  {
    phase: "The Intelligence",
    phaseColor: "#a855f7",
    title: "AI Terminology Translations",
    description: "A secure terminology mapping engine translates non-standard clinician remarks into industry registries like ICD-10 codes, LOINC lab mappings, and RxNorm pharmaceutical files with validated diagnostic accuracy.",
    visual: <TerminologyMapperVisual />,
    stats: [
      { label: "Automated Field Maps", value: "97%" },
      { label: "Terminology Match Score", value: "99.9%" },
      { label: "Translation Speed", value: "< 10ms" },
    ],
  },
  {
    phase: "The Future",
    phaseColor: "#14b8a6",
    title: "Connected Care Infrastructure",
    description: "A single clinical data gateway links all endpoints. Hospitals, laboratories, payers, emergency ambulances, and patient-facing applications form one unified, real-time connected care ecosystem.",
    visual: <DashboardVisual />,
    stats: [
      { label: "Operations SLA", value: "99.99%" },
      { label: "Message Capacity", value: "10M / day" },
      { label: "HIPAA Validation", value: "Complete" },
    ],
  },
];

/* ─── Story Section Container ─── */
function StorySection({ step, index }: { step: StoryStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
      <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-20`}>
        {/* Text Details side */}
        <motion.div
          className="flex-1 max-w-xl"
          initial={{ opacity: 0, x: isEven ? -40 : 40, y: 15 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section Indicator Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border"
            style={{ borderColor: `${step.phaseColor}25`, background: `${step.phaseColor}06` }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: step.phaseColor }} />
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono" style={{ color: step.phaseColor }}>
              {step.phase}
            </span>
          </div>

          {/* Section Headline */}
          <h2 className="text-3xl md:text-[40px] font-extrabold text-gray-900 leading-[1.12] mb-5 tracking-tight">
            {step.title}
          </h2>

          {/* Section Description */}
          <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-10">
            {step.description}
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4">
            {step.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-left p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              >
                <p className="text-xl md:text-2xl font-black" style={{ color: step.phaseColor }}>
                  {stat.value}
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visual Component side */}
        <motion.div
          className="flex-1 w-full max-w-xl relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {step.visual}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main StorytellingJourney component ─── */
export function StorytellingJourney() {
  return (
    <div className="relative">
      {/* Central timeline axis line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #e2e8f0 15%, #e2e8f0 85%, transparent 100%)",
        }}
      />
      {STEPS.map((step, i) => (
        <StorySection key={step.phase} step={step} index={i} />
      ))}
    </div>
  );
}

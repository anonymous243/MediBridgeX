"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Network Node Interface ─── */
interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  connections: string[];
  description: string;
  protocol: string;
  encryption: string;
  latency: string;
  throughput: string;
  sampleLog: string[];
}

const NODES: NetworkNode[] = [
  {
    id: "hospital",
    label: "Hospital EHR",
    x: 50,
    y: 12,
    icon: "🏥",
    color: "#ec4899", // Pink
    connections: ["clinic", "lab", "doctor", "pharmacy", "mbrx"],
    description: "Enterprise hospital EHR systems (Epic, Cerner) containing core clinical records.",
    protocol: "HL7 v2.5 / FHIR Bulk",
    encryption: "AES-256-GCM / TLS 1.3",
    latency: "18ms",
    throughput: "450 txn/s",
    sampleLog: [
      "MSH|^~\\&|EPIC|HOSPITAL|MBRX|",
      "PID|1||MRN-9204||SMITH^JOHN|",
      "PV1|1|O|OP-CLINIC|||||",
      "✓ Encrypted packet sent securely via TLS 1.3",
    ],
  },
  {
    id: "clinic",
    label: "Primary Care",
    x: 20,
    y: 24,
    icon: "🩺",
    color: "#3b82f6", // Blue
    connections: ["hospital", "patient", "doctor", "mbrx"],
    description: "Ambulatory primary care practices and specialty outpatient clinics.",
    protocol: "HL7 v2 / FHIR API",
    encryption: "AES-256 / TLS 1.3",
    latency: "24ms",
    throughput: "120 txn/s",
    sampleLog: [
      "MSH|^~\\&|ECLINICAL|CLINIC|MBRX|",
      "PID|1||MRN-3310||ADAMS^MARY|",
      "OBR|1|ORD-902||VITAL_SIGNS|",
      "✓ Auto-routing vital signs to EHR",
    ],
  },
  {
    id: "doctor",
    label: "Doctor Portal",
    x: 14,
    y: 48,
    icon: "💻",
    color: "#a855f7", // Purple
    connections: ["hospital", "clinic", "lab", "ai", "mbrx"],
    description: "Clinical portal interface providing doctors with active patient dashboard views.",
    protocol: "FHIR R4 / REST JSON",
    encryption: "WPA3 / End-to-End",
    latency: "12ms",
    throughput: "85 txn/s",
    sampleLog: [
      "GET /fhir/Patient/mbrx-4829",
      "HTTP 200 OK - Rendering clinical dashboard",
      "Patient: Smith, John | DOB: 1984-11-12",
      "✓ Visual indicators updated successfully",
    ],
  },
  {
    id: "lab",
    label: "Laboratory",
    x: 22,
    y: 72,
    icon: "🔬",
    color: "#14b8a6", // Teal
    connections: ["hospital", "doctor", "mbrx"],
    description: "Independent labs delivering pathology, hematology, and genetic sequencing feeds.",
    protocol: "HL7 v2.5.1 (ORU^R01)",
    encryption: "AES-256-GCM",
    latency: "32ms",
    throughput: "280 txn/s",
    sampleLog: [
      "MSH|^~\\&|QUEST|LAB|MBRX|",
      "PID|1||MRN-9204||SMITH^JOHN|",
      "OBX|1|NM|WBC||7.2|10*3/uL|",
      "✓ Pathology report dispatched to EHR",
    ],
  },
  {
    id: "government",
    label: "Public Health",
    x: 50,
    y: 86,
    icon: "🏛️",
    color: "#6366f1", // Indigo
    connections: ["hospital", "insurance", "cloud", "ai", "mbrx"],
    description: "State registries, CDC reporting interfaces, and immunization registries.",
    protocol: "HL7 v2 / FHIR Subscriptions",
    encryption: "FIPS 140-2 Validated",
    latency: "45ms",
    throughput: "65 txn/s",
    sampleLog: [
      "MSH|^~\\&|CDC|REGISTRY|MBRX|",
      "VXU^V04^VXU_V04|20260627|",
      "RXA|0|1|20260627|COVID-19|",
      "✓ Public health immunization database updated",
    ],
  },
  {
    id: "insurance",
    label: "Payer Claims",
    x: 78,
    y: 72,
    icon: "🛡️",
    color: "#f59e0b", // Amber
    connections: ["hospital", "pharmacy", "government", "mbrx"],
    description: "Insurance eligibility, prior authorization, and billing clearinghouses.",
    protocol: "X12 270/271 & FHIR CARIN",
    encryption: "AES-256 / SHA-256",
    latency: "28ms",
    throughput: "190 txn/s",
    sampleLog: [
      "ISA*00*          *00*          *",
      "GS*HS*MBRX*PAYER*20260627*1424*",
      "ST*270*0001*005010X279A1~",
      "✓ Eligibility check complete - Approved",
    ],
  },
  {
    id: "pharmacy",
    label: "Pharmacy System",
    x: 86,
    y: 48,
    icon: "💊",
    color: "#10b981", // Emerald
    connections: ["hospital", "patient", "insurance", "mbrx"],
    description: "Prescription networks managing active medication checks and dispensaries.",
    protocol: "NCPDP SCRIPT / FHIR R4",
    encryption: "AES-256-GCM / TLS 1.3",
    latency: "22ms",
    throughput: "310 txn/s",
    sampleLog: [
      "MSH|^~\\&|SURESCRIPTS|RX|MBRX|",
      "RXD|1|AMOXICILLIN|500MG|",
      "ORC|NW|PRES-4929|",
      "✓ Prescription dispatched to pharmacy local terminal",
    ],
  },
  {
    id: "patient",
    label: "Patient App",
    x: 80,
    y: 24,
    icon: "📱",
    color: "#ec4899", // Pink
    connections: ["clinic", "pharmacy", "mbrx"],
    description: "Patient-facing iOS and Android health portal apps.",
    protocol: "Smart on FHIR JSON",
    encryption: "OAuth 2.0 / FaceID AES",
    latency: "15ms",
    throughput: "420 txn/s",
    sampleLog: [
      "GET /fhir/Patient/mbrx-4829/Observation",
      "Authorization: Bearer oauth2-access-token",
      "HTTP 200 OK - Sending vital signs history",
      "✓ Patient app metrics refreshed",
    ],
  },
  {
    id: "ai",
    label: "AI Processing",
    x: 36,
    y: 44,
    icon: "🤖",
    color: "#a855f7", // Purple
    connections: ["hospital", "doctor", "government", "cloud", "mbrx"],
    description: "MediBridgeX AI schema mapping and automated terminology translation engines.",
    protocol: "gRPC / REST JSON APIs",
    encryption: "TLS 1.3 / Enclave Crypt",
    latency: "8ms",
    throughput: "800 txn/s",
    sampleLog: [
      "Inferring unstructured field maps...",
      "Mapping: 'Pt admits to ER' -> HL7 ADT^A01",
      "Confidence score: 99.8%",
      "✓ Schema translation successful",
    ],
  },
  {
    id: "cloud",
    label: "Cloud Engine",
    x: 64,
    y: 44,
    icon: "☁️",
    color: "#14b8a6", // Teal
    connections: ["government", "mbrx"],
    description: "Secure, horizontally-scalable cloud databases and message queue clusters.",
    protocol: "Kafka Streams / REST JSON",
    encryption: "At-Rest Encr / KMS Keys",
    latency: "5ms",
    throughput: "1500 txn/s",
    sampleLog: [
      "Topic: medibridgex.fhir.patients",
      "Partition 2 Offset 92048 write complete",
      "Replicating across 3 availability zones",
      "✓ Database write confirmed",
    ],
  },
  {
    id: "mbrx",
    label: "MediBridgeX Hub",
    x: 50,
    y: 50,
    icon: "⚡",
    color: "#ec4899",
    connections: [
      "hospital",
      "clinic",
      "doctor",
      "lab",
      "government",
      "insurance",
      "pharmacy",
      "patient",
      "ai",
      "cloud",
    ],
    description: "Intelligent core coordinating real-time clinical connections and protocols.",
    protocol: "Universal Parser API",
    encryption: "End-to-End Cryptographic Audit Logs",
    latency: "< 2ms",
    throughput: "5000+ txn/s",
    sampleLog: [
      "MediBridgeX Hub Online • Listening...",
      "Routing engine active • 10 endpoints linked",
      "Security guard active • TLS 1.3 enforced",
      "✓ Zero packet drops recorded",
    ],
  },
];

/* ─── Animated Data Pulse along connections ─── */
function DataPulse({
  x1,
  y1,
  x2,
  y2,
  color,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay: number;
}) {
  return (
    <motion.circle
      r="2.5"
      fill={color}
      filter="url(#pulseGlow)"
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{
        cx: [x1, x2],
        cy: [y1, y2],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
        ease: "easeInOut",
      }}
    />
  );
}

export function HealthcareNetwork() {
  const [selectedId, setSelectedId] = useState<string>("mbrx");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulseKey((k) => k + 1), 15000);
    return () => clearInterval(interval);
  }, []);

  const activeId = hoveredNode || selectedId;
  const activeNodeObj = NODES.find((n) => n.id === activeId) || NODES[10]; // fallback to hub

  const isConnected = useCallback(
    (nodeId: string) => {
      if (nodeId === activeId) return true;
      return activeNodeObj.connections.includes(nodeId);
    },
    [activeId, activeNodeObj]
  );

  const isLineActive = useCallback(
    (fromId: string, toId: string) => {
      return (
        (fromId === activeId && activeNodeObj.connections.includes(toId)) ||
        (toId === activeId && activeNodeObj.connections.includes(fromId))
      );
    },
    [activeId, activeNodeObj]
  );

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-8 w-full max-w-6xl mx-auto px-4">
      {/* ── SVG Ecosystem Visualizer ── */}
      <div className="flex-1 bg-white border border-gray-100/80 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden flex items-center justify-center min-h-[380px] sm:min-h-[500px]">
        {/* Soft radial background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,244,245,0.4)_0%,transparent_80%)] pointer-events-none" />

        <svg viewBox="6 4 88 90" className="w-full h-full max-h-[480px] z-10" style={{ filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.02))" }}>
          <defs>
            <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Connection Links */}
          {NODES.map((node) =>
            node.connections.map((targetId) => {
              const target = NODES.find((n) => n.id === targetId);
              if (!target || node.id > targetId) return null;
              const active = isLineActive(node.id, targetId);
              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={active ? "url(#neonGrad)" : "#f1f5f9"}
                  strokeWidth={active ? 0.6 : 0.25}
                  strokeDasharray={active ? "none" : "1.5,1.5"}
                  animate={{ opacity: active ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                />
              );
            })
          )}

          {/* Data Pulses traveling along routes */}
          {NODES.map((node, ni) =>
            node.connections.map((targetId, ci) => {
              const target = NODES.find((n) => n.id === targetId);
              if (!target || node.id > targetId) return null;
              return (
                <DataPulse
                  key={`pulse-${node.id}-${targetId}-${pulseKey}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  color={node.id === "mbrx" ? "#ec4899" : target.color}
                  delay={ni * 0.2 + ci * 0.4}
                />
              );
            })
          )}

          {/* Graphical Nodes */}
          {NODES.map((node) => {
            const active = isConnected(node.id);
            const isSelected = selectedId === node.id;
            const isCenter = node.id === "mbrx";
            const nodeSize = isCenter ? 7.6 : 5.0;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedId(node.id)}
                style={{ cursor: "pointer" }}
              >
                {/* Concentric rotating outer visual ring */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize + 2}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={0.25}
                  strokeDasharray="2,1.5"
                  animate={{
                    rotate: isSelected ? 360 : 0,
                    opacity: active ? 0.75 : 0.15,
                    scale: active ? 1.05 : 0.95,
                  }}
                  transition={{
                    rotate: { repeat: Infinity, duration: 12, ease: "linear" },
                    default: { duration: 0.3 },
                  }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />

                {/* Main node bubble */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize}
                  fill="white"
                  stroke={isSelected ? node.color : active ? `${node.color}cc` : "#e2e8f0"}
                  strokeWidth={isSelected ? 0.8 : 0.4}
                  filter="url(#nodeGlow)"
                  animate={{
                    opacity: active ? 1 : 0.45,
                    scale: isSelected ? 1.12 : hoveredNode === node.id ? 1.06 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />

                {/* Node icon */}
                <text
                  x={node.x}
                  y={node.y + 0.4}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isCenter ? 5.2 : 3.6}
                  style={{ pointerEvents: "none" }}
                >
                  {node.icon}
                </text>

                {/* Node label */}
                <motion.text
                  x={node.x}
                  y={node.y + (isCenter ? 10.2 : 8.0)}
                  textAnchor="middle"
                  fontSize="2.4"
                  fontWeight="700"
                  fill={isSelected ? "#1e293b" : active ? "#475569" : "#94a3b8"}
                  animate={{ opacity: active ? 1 : 0.45 }}
                  transition={{ duration: 0.2 }}
                  style={{ pointerEvents: "none" }}
                >
                  {node.label}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Real-Time Endpoint Inspector Card ── */}
      <div className="w-full lg:w-[360px] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col text-slate-100 min-h-[380px]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 tracking-wider">ENDPOINT_INSPECTOR v1.0.4</span>
        </div>

        {/* Selected Node Header */}
        <div className="mt-5 flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border"
            style={{
              backgroundColor: `${activeNodeObj.color}15`,
              borderColor: `${activeNodeObj.color}40`,
            }}
          >
            {activeNodeObj.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight truncate">{activeNodeObj.label}</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
              Active Connection
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mt-4">
          {activeNodeObj.description}
        </p>

        {/* Specs Table */}
        <div className="mt-5 space-y-2 text-[11px] font-mono border-t border-b border-slate-800/80 py-4">
          <div className="flex justify-between">
            <span className="text-slate-500">PROTOCOL:</span>
            <span className="text-pink-400 font-semibold">{activeNodeObj.protocol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ENCRYPTION:</span>
            <span className="text-emerald-400 font-semibold">{activeNodeObj.encryption}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">LATENCY:</span>
            <span className="text-blue-400 font-semibold">{activeNodeObj.latency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">THROUGHPUT:</span>
            <span className="text-purple-400 font-semibold">{activeNodeObj.throughput}</span>
          </div>
        </div>

        {/* Animated Terminal Log */}
        <div className="mt-5 flex-1 flex flex-col min-h-[90px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Live Output Stream</span>
            <span className="text-[9px] font-mono text-emerald-500">SECURE CONNECT</span>
          </div>
          <div className="flex-1 bg-slate-950/80 border border-slate-800/50 rounded-xl p-3 font-mono text-[9px] text-slate-300 leading-relaxed overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNodeObj.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeNodeObj.sampleLog.map((line, idx) => (
                  <p
                    key={idx}
                    className={
                      line.startsWith("✓")
                        ? "text-emerald-400 mt-1 font-semibold"
                        : line.startsWith("HTTP") || line.startsWith("Patient")
                        ? "text-blue-400"
                        : "text-slate-500 truncate"
                    }
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

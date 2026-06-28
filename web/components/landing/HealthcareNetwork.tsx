"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Network Node Types ─── */
interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  glow: string;
  connections: string[];
  description: string;
}

const NODES: NetworkNode[] = [
  { id: "hospital", label: "Hospital", x: 50, y: 30, icon: "🏥", color: "#ec4899", glow: "rgba(236,72,153,0.3)", connections: ["lab", "pharmacy", "cloud", "clinic"], description: "Central hospital EHR systems" },
  { id: "lab", label: "Laboratory", x: 20, y: 55, icon: "🔬", color: "#a855f7", glow: "rgba(168,85,247,0.3)", connections: ["hospital", "cloud"], description: "Diagnostic & pathology labs" },
  { id: "pharmacy", label: "Pharmacy", x: 80, y: 55, icon: "💊", color: "#14b8a6", glow: "rgba(20,184,166,0.3)", connections: ["hospital", "insurance", "cloud"], description: "Prescription fulfillment" },
  { id: "clinic", label: "Clinic", x: 15, y: 25, icon: "🩺", color: "#3b82f6", glow: "rgba(59,130,246,0.3)", connections: ["hospital", "cloud", "patient"], description: "Primary care clinics" },
  { id: "patient", label: "Patient App", x: 85, y: 25, icon: "📱", color: "#f59e0b", glow: "rgba(245,158,11,0.3)", connections: ["hospital", "cloud"], description: "Patient health portal" },
  { id: "insurance", label: "Insurance", x: 80, y: 80, icon: "🛡️", color: "#6366f1", glow: "rgba(99,102,241,0.3)", connections: ["pharmacy", "cloud"], description: "Claims & billing systems" },
  { id: "cloud", label: "MediBridgeX", x: 50, y: 58, icon: "⚡", color: "#ec4899", glow: "rgba(236,72,153,0.4)", connections: ["hospital", "lab", "pharmacy", "insurance", "patient", "ambulance", "clinic"], description: "Intelligent interoperability hub" },
  { id: "ambulance", label: "Emergency", x: 20, y: 82, icon: "🚑", color: "#ef4444", glow: "rgba(239,68,68,0.3)", connections: ["hospital", "cloud"], description: "Emergency response systems" },
];

/* ─── Animated Data Pulse ─── */
function DataPulse({ x1, y1, x2, y2, color, delay }: { x1: number; y1: number; x2: number; y2: number; color: string; delay: number }) {
  return (
    <motion.circle
      r="4"
      fill={color}
      filter="url(#pulseGlow)"
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{
        cx: [x1, x2],
        cy: [y1, y2],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1,
        ease: "easeInOut",
      }}
    />
  );
}

export function HealthcareNetwork() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulseKey(k => k + 1), 12000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = useCallback((nodeId: string) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    const hovered = NODES.find(n => n.id === hoveredNode);
    return hovered?.connections.includes(nodeId) ?? false;
  }, [hoveredNode]);

  const isLineActive = useCallback((fromId: string, toId: string) => {
    if (!hoveredNode) return true;
    return hoveredNode === fromId || hoveredNode === toId;
  }, [hoveredNode]);

  return (
    <div className="relative w-full max-w-[700px] aspect-[7/5] mx-auto">
      <svg viewBox="0 10 100 85" className="w-full h-full" style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.04))" }}>
        <defs>
          <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Connection Lines */}
        {NODES.map(node =>
          node.connections.map(targetId => {
            const target = NODES.find(n => n.id === targetId);
            if (!target || node.id > targetId) return null;
            const active = isLineActive(node.id, targetId);
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={node.x} y1={node.y}
                x2={target.x} y2={target.y}
                stroke={active ? "url(#lineGrad)" : "#94a3b8"}
                strokeWidth={active ? 0.45 : 0.3}
                strokeDasharray={active ? "3,3" : "2,2"}
                animate={{ opacity: active ? 0.9 : 0.45 }}
                transition={{ duration: 0.4 }}
              />
            );
          })
        )}

        {/* Data Pulses */}
        {NODES.map((node, ni) =>
          node.connections.map((targetId, ci) => {
            const target = NODES.find(n => n.id === targetId);
            if (!target || node.id > targetId) return null;
            return (
              <DataPulse
                key={`pulse-${node.id}-${targetId}-${pulseKey}`}
                x1={node.x} y1={node.y}
                x2={target.x} y2={target.y}
                color={node.id === "cloud" ? "#ec4899" : target.color}
                delay={ni * 0.3 + ci * 0.7}
              />
            );
          })
        )}

        {/* Nodes */}
        {NODES.map(node => {
          const active = isConnected(node.id);
          const isCenter = node.id === "cloud";
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Outer glow ring */}
              <motion.circle
                cx={node.x} cy={node.y}
                r={isCenter ? 10 : 8}
                fill="none"
                stroke={node.color}
                strokeWidth={0.5}
                strokeDasharray="3,3"
                animate={{
                  opacity: active ? 0.6 : 0.2,
                  r: hoveredNode === node.id ? (isCenter ? 12 : 10) : (isCenter ? 10 : 8),
                }}
                transition={{ duration: 0.3 }}
              />
              {/* Node body */}
              <motion.circle
                cx={node.x} cy={node.y}
                r={isCenter ? 8.5 : 6}
                fill="white"
                stroke={node.color}
                strokeWidth={isCenter ? 1.0 : 0.6}
                filter="url(#nodeGlow)"
                animate={{
                  opacity: active ? 1 : 0.4,
                  scale: hoveredNode === node.id ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />
              {/* Icon */}
              <text
                x={node.x} y={node.y + 0.5}
                textAnchor="middle" dominantBaseline="central"
                fontSize={isCenter ? 6.5 : 4.5}
                style={{ pointerEvents: "none" }}
              >
                {node.icon}
              </text>
              {/* Label */}
              <motion.text
                x={node.x}
                y={node.y + (isCenter ? 13 : 9.5)}
                textAnchor="middle"
                fontSize="3.2"
                fontWeight="700"
                fill={active ? "#1e293b" : "#64748b"}
                animate={{ opacity: active ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
                style={{ pointerEvents: "none" }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-2 shadow-lg pointer-events-none"
          >
            <p className="text-xs font-semibold text-gray-800">
              {NODES.find(n => n.id === hoveredNode)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

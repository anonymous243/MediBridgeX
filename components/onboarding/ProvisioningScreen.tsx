'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  Server, 
  ShieldCheck, 
  Activity, 
  Zap,
  Globe,
  Database,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProvisioningScreenProps {
  onComplete: () => void;
  organizationName?: string;
  organizationSlug?: string;
  region?: string;
}

const STEPS = [
  { id: 'cloud', label: 'Initializing Infrastructure', icon: Globe },
  { id: 'db', label: 'Provisioning HIPAA Databases', icon: Database },
  { id: 'security', label: 'Configuring Encryption Keys', icon: ShieldCheck },
  { id: 'pipeline', label: 'Setting up Message Queues', icon: Activity },
  { id: 'api', label: 'Generating API Credentials', icon: Zap },
  { id: 'verify', label: 'Finalizing Health Checks', icon: Server },
];

const LOG_MESSAGES = [
  "Fetching cloud configuration...",
  "Authenticating with AWS Medical...",
  "Creating VPC: medibridgex-production-vpc",
  "Provisioning dedicated RDS instance (HIPAA isolated)",
  "Applying AES-256 encryption policies",
  "Initializing HL7 v2 ingestion pipeline",
  "Scaling FHIR R4 server nodes",
  "Configuring Redis cluster for event streaming",
  "Seeding audit log database",
  "Registering organization in global registry",
  "Setting up multi-region failover (Syncing data)",
  "Finalizing workspace health check",
  "Workspace provisioned successfully."
];

export function ProvisioningScreen({ onComplete, organizationName = 'Your Organization', organizationSlug = 'workspace', region = 'US East (VA)' }: ProvisioningScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFinished(true);
          return 100;
        }
        return prev + Math.random() * 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentStep(Math.min(Math.floor(progress / (100 / STEPS.length)), STEPS.length - 1));
  }, [progress]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      if (logs.length < LOG_MESSAGES.length) {
        setLogs(prev => [...prev, LOG_MESSAGES[prev.length]]);
      } else {
        clearInterval(logInterval);
      }
    }, 800);

    return () => clearInterval(logInterval);
  }, [logs]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-6 overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-200" />
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: PROGRESS & STEPS */}
        <div className="space-y-12">
            <div>
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-500/40 mb-6"
                >
                    <Rocket className="h-8 w-8" />
                </motion.div>
                <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                    Initializing your <br/>
                    <span className="text-blue-500">Infrastructure</span>
                </h2>
                <p className="mt-4 text-lg font-medium text-slate-400">
                    We're provisioning dedicated healthcare resources. This will take a moment.
                </p>
            </div>

            <div className="space-y-6">
                {STEPS.map((step, idx) => {
                    const isDone = idx < currentStep;
                    const isActive = idx === currentStep;
                    return (
                        <div key={step.id} className="flex items-center gap-4 group">
                            <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-500",
                                isDone ? "border-emerald-500 bg-emerald-500 text-slate-900" : 
                                isActive ? "border-blue-500 bg-blue-500/20 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" : 
                                "border-slate-800 bg-slate-900 text-slate-500"
                            )}>
                                {isDone ? <CheckCircle2 className="h-6 w-6" /> : <step.icon className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                                <p className={cn(
                                    "text-sm font-bold tracking-tight transition-colors duration-500",
                                    isDone ? "text-emerald-500" : isActive ? "text-white" : "text-slate-600"
                                )}>
                                    {step.label}
                                </p>
                                {isActive && (
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        className="h-0.5 bg-blue-500 mt-1 rounded-full opacity-50"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* RIGHT: LOGS & FINAL CTA */}
        <div className="relative">
            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div 
                        key="logs"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-2xl h-[500px] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <Terminal className="h-4 w-4 text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Provisioning Terminal</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                            </div>
                        </div>

                        <div 
                            ref={logContainerRef}
                            className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-hide space-y-2"
                        >
                            {logs.map((log, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-slate-700 select-none">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                    <span className={cn(
                                        "font-bold",
                                        log.includes('successfully') ? "text-emerald-400" : "text-blue-400"
                                    )}>
                                        {log.startsWith('Apply') || log.startsWith('Creating') ? '$' : '>'} {log}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                <span className="text-xs font-bold tracking-tight">System Initialization {Math.round(progress)}%</span>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Instance: us-east-1a
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl border-2 border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl p-10 shadow-2xl text-center space-y-8"
                    >
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-slate-900 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                            <CheckCircle2 className="h-14 w-14" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">Infrastructure Ready</h3>
                            <p className="mt-4 text-lg font-medium text-slate-400">
                                Your dedicated clinical workspace has been provisioned and hardened.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-left">
                            {[
                                { label: 'Endpoint', value: `api.medibridge.x/${organizationSlug}` },
                                { label: 'Security', value: 'HIPAA Hardened' },
                                { label: 'Organization', value: organizationName },
                                { label: 'Region', value: region },
                            ].map(stat => (
                                <div key={stat.label} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                                    <p className="text-sm font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={onComplete}
                            className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest transition-all hover:bg-emerald-500 hover:text-white active:scale-95"
                        >
                            Launch Workspace
                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

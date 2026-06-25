'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  RefreshCcw, 
  Terminal, 
  WifiOff, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  type?: 'network' | 'auth' | 'infrastructure' | 'general';
  title?: string;
  message?: string;
  onRetry?: () => void;
  diagnostics?: string[];
  className?: string;
}

export function ErrorState({
  type = 'general',
  title = 'Critical System Alert',
  message = 'An unexpected failure occurred while processing your request.',
  onRetry,
  diagnostics = [
    'ERR_CONNECTION_REFUSED',
    'NODE_STATUS: DISCONNECTED',
    'UPLINK_LATENCY: TIMEOUT'
  ],
  className
}: ErrorStateProps) {
  const icons = {
    network: WifiOff,
    auth: ShieldAlert,
    infrastructure: Terminal,
    general: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div 
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-red-100 bg-red-50/20 p-12 text-center",
        className
      )}
    >

      <motion.div
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 scale-150 blur-3xl bg-red-100 rounded-full" />
        <div className="relative h-20 w-20 rounded-2xl bg-white shadow-xl shadow-red-200/50 flex items-center justify-center text-red-600">
          <Icon className="h-10 w-10" />
        </div>
      </motion.div>

      <h3 className="text-2xl font-black tracking-tight text-slate-900">{title}</h3>
      <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-slate-500">
        {message}
      </p>

      {/* Diagnostics Panel */}
      <div className="mt-8 w-full max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white p-6 text-left shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Terminal className="h-3 w-3" />
                Diagnostics Summary
            </div>
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        <div className="space-y-2">
            {diagnostics.map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-600">
                    <ChevronRight className="h-3 w-3 text-red-400" />
                    {log}
                </div>
            ))}
        </div>
      </div>

      <div className="mt-10">
        {onRetry && (
          <button
            onClick={onRetry}
            className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-black hover:scale-[1.02] active:scale-95"
          >
            <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
            Resume Infrastructure
          </button>
        )}
      </div>

      <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
        Correlation ID: {Math.random().toString(36).substring(7).toUpperCase()}
      </p>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Activity, 
  Clock, 
  ChevronRight, 
  Terminal,
  ArrowUpRight,
  Shield,
  Cpu
} from 'lucide-react';
import { ApiRequestLog } from '@/types/developers';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RequestViewerProps {
  logs: ApiRequestLog[];
}

export function RequestViewer({ logs }: RequestViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(logs[0]?.id || null);
  const selectedLog = logs.find(log => log.id === selectedId);

  return (
    <div className="flex h-[700px] gap-6">
      {/* LOG LIST */}
      <div className="flex w-[450px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              placeholder="Filter requests..." 
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {logs.map((log) => (
            <button
              key={log.id}
              onClick={() => setSelectedId(log.id)}
              className={cn(
                "group relative flex w-full items-center gap-4 border-b border-slate-50 px-5 py-4 text-left transition-all hover:bg-slate-50",
                selectedId === log.id && "bg-blue-50/50 after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-blue-500"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-[10px]",
                log.statusCode >= 400 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
              )}>
                {log.statusCode}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{log.endpoint}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400">{log.method}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span>{log.latency}ms</span>
                </div>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 text-slate-300 transition-transform",
                selectedId === log.id && "translate-x-1 text-blue-500"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* INSPECTOR */}
      <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {selectedLog ? (
            <motion.div
              key={selectedLog.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest",
                      selectedLog.statusCode >= 400 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {selectedLog.statusCode} {selectedLog.statusCode >= 400 ? 'Error' : 'Success'}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{selectedLog.method} {selectedLog.endpoint}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900">Request Details</h2>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
                  Replay Request <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Latency', value: `${selectedLog.latency}ms`, icon: Activity, color: 'text-blue-500' },
                  { label: 'Retries', value: selectedLog.retryCount, icon: RefreshCcw, color: 'text-amber-500' },
                  { label: 'Auth', value: 'API Key', icon: Shield, color: 'text-emerald-500' },
                  { label: 'Runtime', value: 'Edge', icon: Cpu, color: 'text-purple-500' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* IDs */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Request ID</span>
                  <span className="font-bold text-slate-900">{selectedLog.requestId}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Correlation ID</span>
                  <span className="font-bold text-slate-900">{selectedLog.correlationId}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">User Agent</span>
                  <span className="font-bold text-slate-600 truncate max-w-[300px]">{selectedLog.userAgent}</span>
                </div>
              </div>

              {/* JSON Payload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-black uppercase tracking-widest text-slate-400">Request Body</span>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 font-mono text-xs leading-relaxed text-blue-400">
                  <pre>{JSON.stringify(selectedLog.requestBody || { message: "No body present" }, null, 2)}</pre>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <Activity className="h-12 w-12 opacity-20 mb-4" />
              <p className="font-bold">Select a request to inspect details</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RefreshCcw({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 21v-5h5"/>
        </svg>
    )
}

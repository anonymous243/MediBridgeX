'use client';

import { JsonViewer } from '../fhir/JsonViewer';
import { ShieldCheck, Activity, Zap } from 'lucide-react';

interface FHIRViewerProps {
    json: string;
    latency?: number;
    score?: number;
}

export function FHIRViewer({ json, latency = 89, score = 100 }: FHIRViewerProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FHIR Transformed Payload</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-amber-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{latency}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{score}% Valid</span>
                    </div>
                </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 overflow-hidden">
                <JsonViewer data={json} />
            </div>
            
            {/* Steps Footer */}
            <div className="border-t border-white/10 bg-slate-900 px-6 py-3">
                <div className="flex items-center gap-6">
                    <StepIndicator label="Map" active />
                    <StepIndicator label="Validate" active />
                    <StepIndicator label="Optimize" active />
                    <StepIndicator label="Finalize" active />
                </div>
            </div>
        </div>
    );
}

function StepIndicator({ label, active }: { label: string, active?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-600'}`}>
                {label}
            </span>
        </div>
    );
}

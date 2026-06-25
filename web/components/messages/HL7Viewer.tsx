'use client';

import { Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';

interface HL7ViewerProps {
    payload: string;
}

export function HL7Viewer({ payload }: HL7ViewerProps) {
    const [copied, setCopied] = useState(false);
    const segments = payload.split('\n');

    const handleCopy = () => {
        navigator.clipboard.writeText(payload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Raw HL7 Payload</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-100"
                    >
                        {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100">
                        <Download className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed">
                <table className="w-full border-collapse">
                    <tbody>
                        {segments.map((segment, i) => {
                            const [id, ...rest] = segment.split('|');
                            return (
                                <tr key={i} className="group hover:bg-slate-100/50">
                                    <td className="w-12 select-none pr-4 text-right font-mono text-[10px] font-bold text-slate-300">
                                        {(i + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="py-1">
                                        <span className="font-black text-blue-600">{id}</span>
                                        <span className="text-slate-400">|</span>
                                        <span className="text-slate-700">{rest.join('|')}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {/* Footer */}
            <div className="border-t border-slate-200 bg-white px-6 py-3">
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Encoding: ASCII</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Segments: {segments.length}</span>
                </div>
            </div>
        </div>
    );
}

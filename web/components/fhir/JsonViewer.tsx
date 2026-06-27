'use client';

import { useState } from 'react';
import { Copy, Download, ChevronDown, ChevronRight, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

interface JsonViewerProps {
    data: string;
    filename?: string;
}

export function JsonViewer({ data, filename = 'resource.json' }: JsonViewerProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleCopy = () => {
        navigator.clipboard.writeText(data);
        toast.success('JSON copied to clipboard');
    };

    const handleDownload = () => {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Simple syntax highlighting logic (regex based for demonstration)
    const highlightJson = (json: string) => {
        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match) => {
                let cls = 'text-slate-300'; // default
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'text-blue-400'; // key
                    } else {
                        cls = 'text-emerald-400'; // string
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'text-orange-400'; // boolean
                } else if (/null/.test(match)) {
                    cls = 'text-rose-400'; // null
                } else {
                    cls = 'text-purple-400'; // number
                }
                return `<span class="${cls}">${match}</span>`;
            }
        );
    };

    const lines = data.split('\n');

    return (
        <div className="group relative rounded-3xl border border-slate-800 bg-slate-950 p-1 shadow-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <FileJson className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {filename}
                    </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                        <Copy className="h-3 w-3" /> Copy
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                        <Download className="h-3 w-3" /> Download
                    </button>
                </div>
            </div>

            {/* Viewer */}
            <div className="max-h-[600px] overflow-auto p-6 scrollbar-hide">
                <div className="flex gap-6 font-mono text-xs leading-relaxed">
                    {/* Line Numbers */}
                    <div className="flex flex-col text-slate-600 select-none text-right min-w-[20px]">
                        {lines.map((_, i) => (
                            <span key={i}>{i + 1}</span>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 mb-2 text-slate-500 hover:text-slate-300 transition"
                        >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            <span className="font-bold">JSON Root</span>
                        </button>

                        {isExpanded && (
                            <pre 
                                className="whitespace-pre-wrap break-all"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightJson(data)) }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
    );
}

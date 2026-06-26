'use client';

import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

interface CodeBlockProps {
  code: string;
  language: 'typescript' | 'python' | 'java' | 'bash';
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (code: string, lang: string) => {
    // Simple mock highlighter for different languages
    if (lang === 'bash') {
      return code.replace(/(curl|--header|-H|-d|--data|-X|GET|POST|PUT|DELETE)/g, '<span class="text-blue-400">$1</span>')
                 .replace(/("[^"]*")/g, '<span class="text-emerald-400">$1</span>');
    }
    
    return code.replace(/(\bimport\b|\bfrom\b|\bconst\b|\bexport\b|\bclass\b|\bpublic\b|\bstatic\b|\bvoid\b|\bdef\b|\breturn\b|\bif\b|\belse\b)/g, '<span class="text-purple-400">$1</span>')
               .replace(/(\bstring\b|\bnumber\b|\bboolean\b|\bany\b|\bList\b|\bString\b)/g, '<span class="text-blue-300 font-italic">$1</span>')
               .replace(/("[^"]*"|'[^']*')/g, '<span class="text-emerald-400">$1</span>')
               .replace(/(\/\/.+|\#.+)/g, '<span class="text-slate-500">$1</span>');
  };

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-slate-400">
            <Terminal className="h-3 w-3" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {filename || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-auto p-4 scrollbar-hide">
        <pre className="font-mono text-xs leading-relaxed text-slate-300">
          <code dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightCode(code, language)) }} />
        </pre>
      </div>
      
      {/* Visual Accents */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </div>
  );
}

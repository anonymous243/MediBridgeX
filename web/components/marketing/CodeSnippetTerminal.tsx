"use client";

import React, { useState } from 'react';
import { Terminal, Copy, CheckCircle2 } from 'lucide-react';

interface CodeSnippetTerminalProps {
  code: string;
  filename: string;
  language?: string;
}

export function CodeSnippetTerminal({ code, filename, language = 'json' }: CodeSnippetTerminalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightSyntax = (line: string, lang: string) => {
    let highlighted = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    if (lang === 'json') {
      highlighted = highlighted.replace(/"([^"]+)"(?=\s*:)/g, '%%KEY%%&quot;$1&quot;%%END%%'); 
      highlighted = highlighted.replace(/(:\s*)("([^"]*)")/g, '$1%%STR%%$2%%END%%'); 
      highlighted = highlighted.replace(/(:\s*)([0-9.-]+)/g, '$1%%NUM%%$2%%END%%'); 
      highlighted = highlighted.replace(/(:\s*)(true|false|null)\b/g, '$1%%BOOL%%$2%%END%%'); 
      
      highlighted = highlighted.replace(/%%KEY%%/g, '<span class="text-[#79C0FF]">');
      highlighted = highlighted.replace(/%%STR%%/g, '<span class="text-[#A5D6FF]">');
      highlighted = highlighted.replace(/%%NUM%%/g, '<span class="text-[#FFAB70]">');
      highlighted = highlighted.replace(/%%BOOL%%/g, '<span class="text-[#FF7B72]">');
      highlighted = highlighted.replace(/%%END%%/g, '</span>');
    } else if (lang === 'javascript') {
      highlighted = highlighted.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '%%STR%%$1%%END%%'); 
      highlighted = highlighted.replace(/(\/\/.*)/g, '%%COM%%$1%%END%%');
      highlighted = highlighted.replace(/\b(const|let|var|await|async|function|return|if|else|true|false)\b/g, '%%KWD%%$1%%END%%');
      highlighted = highlighted.replace(/\b(fetch|json|console|log)\b/g, '%%FUNC%%$1%%END%%');

      highlighted = highlighted.replace(/%%STR%%/g, '<span class="text-[#A5D6FF]">');
      highlighted = highlighted.replace(/%%COM%%/g, '<span class="text-[#8B949E]">');
      highlighted = highlighted.replace(/%%KWD%%/g, '<span class="text-[#FF7B72]">');
      highlighted = highlighted.replace(/%%FUNC%%/g, '<span class="text-[#D2A8FF]">');
      highlighted = highlighted.replace(/%%END%%/g, '</span>');
    }
    return highlighted;
  };

  return (
    <div className="group relative w-full rounded-2xl overflow-hidden bg-[#0D1117] border border-gray-800 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_80px_-15px_rgba(168,85,247,0.3)] hover:border-purple-500/30">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-gray-800 transition-colors duration-500 group-hover:border-purple-500/30 group-hover:bg-[#1a1f27]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
          </div>
          <span className="ml-4 text-xs font-mono text-gray-400 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="group-hover:text-purple-300 transition-colors">{filename}</span>
          </span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-all duration-200 active:scale-95 bg-gray-800/50 hover:bg-gray-700/50 p-1.5 rounded-md"
          title="Copy code"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code className="text-[#C9D1D9]">
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex hover:bg-white/[0.02] px-2 -mx-2 rounded transition-colors">
                <span className="w-8 text-right pr-4 text-gray-600 select-none border-r border-gray-800/50 mr-4">{i + 1}</span>
                <span 
                  className="whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: highlightSyntax(line, language) }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

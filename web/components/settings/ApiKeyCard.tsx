'use client';

import React, { useState } from 'react';
import { Key, Copy, Check, Trash2, Eye, EyeOff, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ApiKeyCardProps {
  name: string;
  apiKey: string;
  lastUsed?: string;
  createdAt: string;
  onRevoke?: () => void;
}

export function ApiKeyCard({
  name,
  apiKey,
  lastUsed,
  createdAt,
  onRevoke,
}: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:bg-white hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{name}</h4>
            <div className="mt-1 flex items-center gap-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Created {createdAt}
              </span>
              {lastUsed && (
                <span className="flex items-center gap-1">
                  Last used {lastUsed}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKey(!showKey)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={handleCopy}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={onRevoke}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative rounded-xl border border-slate-200 bg-slate-100/50 px-4 py-2.5 font-mono text-sm text-slate-600">
          {showKey ? apiKey : '•'.repeat(apiKey.length / 2) + apiKey.slice(-4)}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Key, Copy, Check, Trash2, Eye, EyeOff, Clock, Shield, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ApiKey } from '@/types/developers';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onRevoke?: (id: string) => void;
}

export function ApiKeyCard({
  apiKey,
  onRevoke,
}: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Background Accent */}
      <div className={cn(
        "absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full blur-3xl transition-opacity opacity-10 group-hover:opacity-20",
        apiKey.environment === 'live' ? "bg-blue-500" : "bg-purple-500"
      )} />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner",
            apiKey.environment === 'live' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
          )}>
            <Key className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-bold text-slate-900">{apiKey.name}</h4>
              <span className={cn(
                "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest",
                apiKey.environment === 'live' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              )}>
                {apiKey.environment}
              </span>
              {apiKey.status === 'revoked' && (
                <span className="rounded-lg bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-red-700">
                  Revoked
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Created {new Date(apiKey.createdAt).toLocaleDateString()}
              </span>
              {apiKey.lastUsedAt && (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Last used {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> {apiKey.scopes.length} Scopes
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKey(!showKey)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-950"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={handleCopy}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-950"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onRevoke?.(apiKey.id)}
            disabled={apiKey.status === 'revoked'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition-all hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Key Display */}
      <div className="mt-6">
        <div className="group/key relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-sm">
          <div className="flex items-center justify-between">
             <span className="text-slate-600">
                {showKey ? apiKey.key : '•'.repeat(24) + apiKey.key.slice(-4)}
             </span>
             <div className="flex gap-2">
                {apiKey.scopes.slice(0, 2).map(scope => (
                    <span key={scope} className="rounded-md bg-slate-200/50 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                        {scope}
                    </span>
                ))}
                {apiKey.scopes.length > 2 && (
                    <span className="text-[10px] font-bold text-slate-400">
                        +{apiKey.scopes.length - 2} more
                    </span>
                )}
             </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar for Expiration (Mock) */}
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Key Health</span>
            <span>98% Secure</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[98%] bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>
      </div>
    </div>
  );
}

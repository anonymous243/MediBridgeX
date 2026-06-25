'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RetryStateProps {
  onRetry: () => void;
  message?: string;
  isRetrying?: boolean;
  className?: string;
}

export function RetryState({
  onRetry,
  message = "Operation failed. Connection interrupted.",
  isRetrying = false,
  className
}: RetryStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 rounded-2xl bg-amber-50/50 border border-amber-100",
      className
    )}>
      <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5" />
      </div>
      
      <p className="text-sm font-bold text-slate-900 text-center mb-6">
        {message}
      </p>

      <button
        onClick={onRetry}
        disabled={isRetrying}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 disabled:opacity-50",
          isRetrying && "cursor-not-allowed"
        )}
      >
        <RefreshCcw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")} />
        {isRetrying ? 'Synchronizing...' : 'Retry Operation'}
      </button>

      <p className="mt-4 text-[10px] font-medium text-slate-400">
        Automatic retry in 5s
      </p>
    </div>
  );
}

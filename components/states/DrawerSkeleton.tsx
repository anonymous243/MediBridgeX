'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function DrawerSkeleton() {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-slate-100 animate-pulse" />
        <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-100 pb-2">
        <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
      </div>

      {/* Content */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
             <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
             <div className="h-12 w-full rounded-2xl border border-slate-100 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Action Area */}
      <div className="pt-8 space-y-4">
         <div className="h-px bg-slate-100" />
         <div className="flex gap-4">
            <div className="h-12 flex-1 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-12 flex-1 rounded-2xl bg-slate-200 animate-pulse" />
         </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardSkeletonProps {
  className?: string;
}

export function DashboardSkeleton({ className }: DashboardSkeletonProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header Skeleton */}
      <div className="flex items-end justify-between">
        <div className="space-y-4">
          <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
          <div className="h-10 w-64 rounded-xl bg-slate-200 animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-32 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-12 w-48 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-3xl border border-slate-100 bg-white p-6 space-y-4">
             <div className="flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-slate-50 animate-pulse" />
                <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
             </div>
             <div className="h-8 w-24 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
           <div className="h-[600px] rounded-[2.5rem] border border-slate-100 bg-white animate-pulse" />
        </div>
        <div className="space-y-6">
           <div className="h-[280px] rounded-[2.5rem] border border-slate-100 bg-white animate-pulse" />
           <div className="h-[280px] rounded-[2.5rem] border border-slate-100 bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}

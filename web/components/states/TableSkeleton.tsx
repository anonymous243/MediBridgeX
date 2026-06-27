'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4,
  className 
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-3xl border border-slate-100 bg-white", className)}>
      {/* Header Skeleton */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`head-${i}`} className="flex-1 px-4">
            <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Row Skeletons */}
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <motion.div 
            key={`row-${rowIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.05 }}
            className="flex px-6 py-5 items-center"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={`col-${rowIndex}-${colIndex}`} className="flex-1 px-4">
                {colIndex === 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
                      <div className="h-3 w-20 rounded bg-slate-50 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <div className={cn(
                    "h-4 rounded animate-pulse",
                    colIndex === columns - 1 ? "w-16 ml-auto" : "w-24"
                  )} style={{ 
                    backgroundColor: `rgba(241, 245, 249, ${1 - (colIndex * 0.1)})` 
                  }} />
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

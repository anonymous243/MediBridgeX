'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function SettingsCard({
  children,
  className,
  title,
  description,
}: SettingsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      {/* Subtle Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      
      <div className="p-8">
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-lg font-bold tracking-tight text-slate-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

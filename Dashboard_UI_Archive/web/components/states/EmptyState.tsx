'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LucideIcon, 
  Plus, 
  Inbox,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
  secondaryActionLabel,
  onSecondaryAction
}: EmptyStateProps) {
  return (
    <div 
      role="status"
      className={cn(
        "flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/30 p-12 text-center",
        className
      )}
    >

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 scale-150 blur-3xl bg-blue-100/50 rounded-full" />
        <div className="relative h-24 w-24 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400">
          <Icon className="h-10 w-10" />
        </div>
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
        >
          <Plus className="h-4 w-4" />
        </motion.div>
      </motion.div>

      <h3 className="text-2xl font-black tracking-tight text-slate-900">{title}</h3>
      <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-slate-500">
        {description}
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        {actionLabel && (
          <button
            onClick={onAction}
            className="group flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
          </button>
        )}
        
        {secondaryActionLabel && (
          <button
            onClick={onSecondaryAction}
            className="group flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            {secondaryActionLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      <div className="mt-12 flex items-center gap-8 pt-8 border-t border-slate-100/50">
         <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Infrastructure</span>
            <span className="text-xs font-bold text-slate-900">v4.2.0-STABLE</span>
         </div>
         <div className="h-4 w-px bg-slate-100" />
         <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</span>
            <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-900">Operational</span>
            </div>
         </div>
      </div>
    </div>
  );
}

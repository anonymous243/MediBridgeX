'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export function LoadingState({ 
  message = 'Initializing infrastructure...', 
  className,
  size = 'md' 
}: LoadingStateProps) {
  if (size === 'fullscreen') {
    return (
      <div 
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">
            {message}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      role="status"
      aria-live="polite"
      className={cn(
      "flex flex-col items-center justify-center py-12 px-4",
      size === 'lg' ? "min-h-[400px]" : size === 'md' ? "min-h-[200px]" : "min-h-[100px]",
      className
    )}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={cn(
          "rounded-full border-2 border-slate-100 border-t-blue-600",
          size === 'lg' ? "h-12 w-12" : size === 'md' ? "h-8 w-8" : "h-6 w-6"
        )}
      />
      {message && (
        <p className={cn(
          "mt-4 font-bold text-slate-400",
          size === 'lg' ? "text-base" : "text-xs"
        )}>
          {message}
        </p>
      )}
    </div>
  );
}

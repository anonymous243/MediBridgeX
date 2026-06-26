import React from 'react';

import { cn } from '@/lib/utils';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        `
        relative overflow-hidden rounded-[32px]
        border border-slate-200/80
        bg-white/90
        p-8
        shadow-[0_10px_50px_rgba(15,23,42,0.06)]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_80px_rgba(15,23,42,0.10)]
        `,
        className
      )}
    >
      {/* TOP GRADIENT */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />

      {/* GLOW */}
      <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
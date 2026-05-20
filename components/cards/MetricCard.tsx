import React from 'react';

import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        `
        group
        relative
        overflow-hidden
        rounded-[32px]
        border border-slate-200/80
        bg-white/90
        p-7
        shadow-[0_10px_40px_rgba(15,23,42,0.05)]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]
        `,
        className
      )}
    >
      {/* TOP LINE */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />

      {/* GLOW */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="relative z-10 flex items-start justify-between">
        {/* LEFT */}
        <div>
          <p className="text-sm font-bold tracking-[-0.01em] text-slate-500">
            {title}
          </p>

          <h3 className="mt-5 text-4xl sm:text-5xl font-black tracking-[-0.06em] text-slate-950">
            {value}
          </h3>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] sm:text-xs font-bold text-emerald-600">
            +12.8%
          </div>
        </div>

        {/* ICON */}
        <div
          className="
            flex h-16 w-16 items-center justify-center
            rounded-3xl
            bg-slate-50
            transition-all duration-300
            group-hover:scale-110
          "
        >
          <Icon
            className={cn(
              'h-7 w-7',
              color || 'text-slate-700'
            )}
          />
        </div>
      </div>
    </div>
  );
}
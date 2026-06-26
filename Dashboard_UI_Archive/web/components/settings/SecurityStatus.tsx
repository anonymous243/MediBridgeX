'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityStatusProps {
  label: string;
  status: 'compliant' | 'warning' | 'error' | 'active';
  className?: string;
}

const statusConfig = {
  compliant: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
  active: {
    icon: ShieldCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  warning: {
    icon: ShieldAlert,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
  error: {
    icon: ShieldAlert,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
  },
};

export function SecurityStatus({ label, status, className }: SecurityStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 transition-all hover:shadow-sm",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm", config.color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 opacity-70">
          Status
        </p>
        <h4 className={cn("text-sm font-black tracking-tight", config.color)}>
          {label}
        </h4>
      </div>
    </div>
  );
}

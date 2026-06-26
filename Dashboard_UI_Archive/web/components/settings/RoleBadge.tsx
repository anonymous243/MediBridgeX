'use client';

import React from 'react';
import { Shield, User, Hammer, Terminal, Search, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type RoleType = 'Administrator' | 'Developer' | 'Operator' | 'Auditor' | 'Member';

interface RoleBadgeProps {
  role: RoleType;
  className?: string;
}

const roleConfig: Record<RoleType, { label: string; icon: LucideIcon; className: string }> = {
  'Administrator': {
    label: 'Admin',
    icon: Shield,
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
  },
  'Developer': {
    label: 'Dev',
    icon: Terminal,
    className: 'bg-blue-50 text-blue-700 border-blue-200/50',
  },
  'Operator': {
    label: 'Ops',
    icon: Hammer,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  },
  'Auditor': {
    label: 'Audit',
    icon: Search,
    className: 'bg-slate-50 text-slate-700 border-slate-200/50',
  },
  'Member': {
    label: 'Member',
    icon: User,
    className: 'bg-slate-50 text-slate-600 border-slate-200/50',
  },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role] || roleConfig['Member'];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  );
}

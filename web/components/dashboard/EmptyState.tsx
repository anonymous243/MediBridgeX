import React from 'react';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
        <Icon className="h-8 w-8 text-slate-500" />
      </div>

      <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-slate-950">
        {title}
      </h3>

      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}
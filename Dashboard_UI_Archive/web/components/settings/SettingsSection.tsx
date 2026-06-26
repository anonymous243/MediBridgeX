'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

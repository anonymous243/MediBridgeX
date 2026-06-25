'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from './Switch';

interface NotificationToggleProps {
  title: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function NotificationToggle({
  title,
  description,
  icon: Icon,
  enabled,
  onChange,
}: NotificationToggleProps) {
  return (
    <div className={cn(
      "flex items-start justify-between p-4 rounded-2xl border transition-all",
      enabled ? "border-blue-100 bg-blue-50/20" : "border-slate-100 bg-slate-50/50"
    )}>
      <div className="flex gap-4">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all",
          enabled ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-100 text-slate-400"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className={cn("text-sm font-bold transition-colors", enabled ? "text-blue-900" : "text-slate-900")}>
            {title}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>
      <div className="pt-1">
        <Switch checked={enabled} onCheckedChange={onChange} />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Database, 
  Layers, 
  Webhook, 
  ShieldCheck, 
  Zap,
  Check,
  Cpu,
  RefreshCcw,
  Boxes
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InfrastructureModule } from '@/types/onboarding';

const MODULE_ICONS: Record<string, any> = {
  hl7: Activity,
  fhir: Database,
  dicom: Layers,
  webhooks: Webhook,
  api: Zap,
  audit: ShieldCheck,
  streaming: Boxes
};

interface InfrastructureCardProps {
  module: InfrastructureModule;
  onToggle: (id: string) => void;
}

export function InfrastructureCard({ module, onToggle }: InfrastructureCardProps) {
  const Icon = MODULE_ICONS[module.id] || Cpu;

  return (
    <button
      onClick={() => onToggle(module.id)}
      className={cn(
        "group relative flex flex-col gap-4 rounded-3xl border-2 p-6 text-left transition-all hover:shadow-xl",
        module.enabled 
          ? "border-blue-600 bg-blue-50/50" 
          : "border-slate-100 bg-white hover:border-slate-200"
      )}
    >
      <div className="flex items-start justify-between w-full">
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500",
          module.enabled ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
        )}>
          <Icon className={cn("h-7 w-7", module.enabled && "animate-pulse")} />
        </div>
        <div className={cn(
            "h-6 w-11 rounded-full transition-colors relative",
            module.enabled ? "bg-blue-600" : "bg-slate-200"
        )}>
            <motion.div 
                className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                animate={{ x: module.enabled ? 20 : 0 }}
            />
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{module.name}</h3>
            {module.enabled && (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <RefreshCcw className="h-2 w-2 animate-spin" /> Provisioning
                </span>
            )}
        </div>
        <p className="mt-1 text-sm font-medium text-slate-500 leading-relaxed">
          {module.description}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
         <span>Enterprise Tier</span>
         <span>v4.2.0</span>
      </div>
      
      {module.enabled && (
        <motion.div 
          layoutId={`glow-${module.id}`}
          className="absolute -inset-[2px] rounded-3xl border-2 border-blue-500/20 pointer-events-none"
        />
      )}
    </button>
  );
}

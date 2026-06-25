'use client';

import React from 'react';
import { MapPin, Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const REGIONS = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', city: 'Ashburn, VA', latency: '12ms' },
  { id: 'eu-west-1', name: 'EU West (Ireland)', city: 'Dublin, IE', latency: '84ms' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', city: 'Singapore, SG', latency: '142ms' },
  { id: 'us-west-2', name: 'US West (Oregon)', city: 'Portland, OR', latency: '45ms' },
];

interface RegionSelectorProps {
  value: string;
  onChange: (region: string) => void;
}

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {REGIONS.map((region) => {
        const isActive = value === region.name;
        return (
          <button
            key={region.id}
            onClick={() => onChange(region.name)}
            className={cn(
              "group relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
              isActive ? "border-blue-600 bg-blue-50/50" : "border-slate-100 bg-white hover:border-slate-200"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
            )}>
              <Globe className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{region.name}</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {region.city}</span>
                 <span className="h-1 w-1 rounded-full bg-slate-300" />
                 <span className="text-emerald-500">{region.latency}</span>
              </div>
            </div>

            {isActive && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </motion.div>
            )}
          </button>
        );
      })}
    </div>
  );
}

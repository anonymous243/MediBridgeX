'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileCheck, 
  Timer, 
  Smartphone,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ComplianceSetupProps {
  settings: {
    mfa: boolean;
    auditLogging: boolean;
    hipaaControls: boolean;
    encryption: boolean;
    sessionTimeout: boolean;
    deviceTrust: boolean;
  };
  onChange: (key: keyof ComplianceSetupProps['settings'], value: boolean) => void;
}


const COMPLIANCE_ITEMS: { id: keyof ComplianceSetupProps['settings']; name: string; desc: string; icon: LucideIcon }[] = [
  { id: 'mfa', name: 'MFA Enforcement', desc: 'Require multi-factor authentication for all workspace users.', icon: Lock },
  { id: 'hipaaControls', name: 'HIPAA Compliance', desc: 'Enable strict clinical data isolation and privacy controls.', icon: ShieldCheck },
  { id: 'auditLogging', name: 'Audit Logging', desc: 'Immutable record of all system access and data modifications.', icon: Eye },
  { id: 'encryption', name: 'Data Encryption', desc: 'AES-256 encryption at rest and TLS 1.3 in transit.', icon: FileCheck },
  { id: 'sessionTimeout', name: 'Session Timeout', desc: 'Automatic logout after 30 minutes of inactivity.', icon: Timer },
  { id: 'deviceTrust', name: 'Device Trust', desc: 'Allow access only from managed and verified hardware.', icon: Smartphone },
];

export function ComplianceSetup({ settings, onChange }: ComplianceSetupProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-900">Security Posture</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enterprise Standards</p>
            </div>
         </div>
         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SOC 2 Type II Compliant
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {COMPLIANCE_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id, !settings[item.id])}
            className={cn(
              "group flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all",
              settings[item.id]
                ? "border-emerald-600 bg-emerald-50/50"
                : "border-slate-100 bg-white hover:border-slate-200"
            )}
          >

            <div className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
              settings[item.id]
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
            )}>
              <item.icon className="h-6 w-6" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{item.name}</p>
              <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
            
            <div className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                settings[item.id] ? "border-emerald-600 bg-emerald-600" : "border-slate-200"
            )}>
                {settings[item.id] && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <ShieldCheck className="h-3 w-3 text-white" />
                    </motion.div>
                )}
            </div>

          </button>
        ))}
      </div>
      
      <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                 <Lock className="h-3 w-3" /> Encryption Status
              </div>
              <p className="text-sm font-medium opacity-80">
                  All healthcare data is protected by <span className="text-blue-400 font-bold">FIPS 140-2</span> validated encryption modules and hardware security keys.
              </p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
              <ShieldCheck size={160} />
          </div>
      </div>
    </div>
  );
}

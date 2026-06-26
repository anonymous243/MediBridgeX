'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Zap, Layers, Check } from 'lucide-react';
import { FhirVersion } from '@/types/onboarding';
import { cn } from '@/lib/utils';

const FHIR_VERSIONS: FhirVersion[] = ['FHIR R4', 'FHIR R4B', 'FHIR R5', 'FHIR DSTU2'];

const CLOUD_REGIONS = [
  { id: 'us-east', label: 'US East (N. Virginia)', flag: '🇺🇸' },
  { id: 'us-west', label: 'US West (Oregon)', flag: '🇺🇸' },
  { id: 'eu-central', label: 'EU Central (Frankfurt)', flag: '🇪🇺' },
  { id: 'ap-south', label: 'AP South (Singapore)', flag: '🇸🇬' },
];

interface InfraPreferencesProps {
  fhirVersion: FhirVersion;
  hl7Support: boolean;
  cloudRegion: string;
  realtimeStreaming: boolean;
  onFhirChange: (v: FhirVersion) => void;
  onHl7Toggle: () => void;
  onRegionChange: (r: string) => void;
  onStreamingToggle: () => void;
}

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    role="switch"
    aria-checked={enabled}
    className={cn(
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
      enabled ? 'bg-blue-600' : 'bg-slate-200'
    )}
  >
    <motion.span
      animate={{ x: enabled ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
    />
  </button>
);

export function InfraPreferencesStep({
  fhirVersion,
  hl7Support,
  cloudRegion,
  realtimeStreaming,
  onFhirChange,
  onHl7Toggle,
  onRegionChange,
  onStreamingToggle,
}: InfraPreferencesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* FHIR Version */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">FHIR Version</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select your target interoperability standard</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FHIR_VERSIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onFhirChange(v)}
              className={cn(
                'flex items-center justify-between rounded-2xl border p-4 text-left transition-all',
                fhirVersion === v
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
              )}
            >
              <span className="text-sm font-bold">{v}</span>
              {fhirVersion === v && <Check className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
        {fhirVersion === 'FHIR R5' && (
          <p className="text-[11px] font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
            ⚠ FHIR R5 support is in preview. Contact support before enabling in production.
          </p>
        )}
      </div>

      {/* Cloud Region */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Data Residency</h3>
            <p className="text-xs text-slate-500 mt-0.5">Clinical data is isolated to this region</p>
          </div>
        </div>
        <div className="space-y-3">
          {CLOUD_REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => onRegionChange(region.label)}
              className={cn(
                'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all',
                cloudRegion === region.label
                  ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
              )}
            >
              <span className="text-2xl">{region.flag}</span>
              <span className={cn('text-sm font-bold', cloudRegion === region.label ? 'text-purple-700' : 'text-slate-700')}>
                {region.label}
              </span>
              {cloudRegion === region.label && <Check className="ml-auto h-4 w-4 text-purple-600 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-base font-black text-slate-900 mb-6">Integration Requirements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">HL7 v2 Support</p>
                <p className="text-xs text-slate-500">Enable legacy HL7 v2 ingestion pipelines</p>
              </div>
            </div>
            <Toggle enabled={hl7Support} onToggle={onHl7Toggle} />
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Real-time Streaming</p>
                <p className="text-xs text-slate-500">Kafka-based event streaming for live data</p>
              </div>
            </div>
            <Toggle enabled={realtimeStreaming} onToggle={onStreamingToggle} />
          </div>
        </div>
      </div>
    </div>
  );
}

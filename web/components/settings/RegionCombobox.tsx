'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const regions = [
  { id: 'us-east-1', name: 'US-East (N. Virginia)', country: 'USA' },
  { id: 'us-west-2', name: 'US-West (Oregon)', country: 'USA' },
  { id: 'eu-central-1', name: 'Europe (Frankfurt)', country: 'Germany' },
  { id: 'eu-west-2', name: 'Europe (London)', country: 'UK' },
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', country: 'India' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', country: 'Singapore' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', country: 'Japan' },
  { id: 'ca-central-1', name: 'Canada Central', country: 'Canada' },
  { id: 'au-southeast-2', name: 'Australia Sydney', country: 'Australia' },
];

interface RegionComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function RegionCombobox({ value, onChange }: RegionComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRegion = regions.find(r => r.id === value) || regions[0];

  const filteredRegions = regions.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.country.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-semibold text-slate-900 transition-all hover:bg-white focus:border-blue-500 focus:bg-white focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-slate-400" />
          {selectedRegion.name}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-xl"
          >
            <div className="sticky top-0 border-b border-slate-100 bg-white p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search regions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto p-1">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      onChange(region.id);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors",
                      value === region.id ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span>{region.name}</span>
                      <span className="text-[10px] font-medium opacity-60 uppercase tracking-wider">{region.country}</span>
                    </div>
                    {value === region.id && <Check className="h-4 w-4" />}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-400 font-medium">
                  No regions found matching "{search}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { Search, Filter, Calendar, MapPin, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ResourceFilters() {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Global FHIR Search (Patient, MRN, ID...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                    {search && (
                        <button 
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-slate-100"
                        >
                            <X className="h-3 w-3 text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Quick Filters */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        All Regions
                    </button>
                    
                    <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        Last 24h
                    </button>

                    <button 
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                    >
                        <Filter className="h-4 w-4" />
                        Advanced
                        <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {isAdvancedOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 lg:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Type</label>
                                <select className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-bold outline-none">
                                    <option>All Resources</option>
                                    <option>Patient</option>
                                    <option>Observation</option>
                                    <option>Encounter</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                                <select className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-bold outline-none">
                                    <option>Any Status</option>
                                    <option>Validated</option>
                                    <option>Failed</option>
                                    <option>Processing</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Validation Score</label>
                                <select className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-bold outline-none">
                                    <option>All</option>
                                    <option>&gt; 90%</option>
                                    <option>&lt; 50%</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button className="w-full rounded-xl bg-slate-950 py-2.5 text-sm font-bold text-white transition hover:opacity-90">
                                    Apply Advanced Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

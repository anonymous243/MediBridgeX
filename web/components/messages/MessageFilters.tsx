'use client';

import { Search, Filter, Calendar, Globe, Database, Activity, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMessageStore } from '@/stores/useMessageStore';

export function MessageFilters() {
    const { filterQuery, setFilterQuery, statusFilter, setStatusFilter } = useMessageStore();

    return (
        <div className="flex flex-col gap-4">
            {/* Main Search Bar */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-950" />
                <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search by Correlation ID, Patient Name, or Message ID..."
                    className="w-full rounded-[24px] border border-slate-200 bg-white py-6 pl-16 pr-8 text-sm font-medium outline-none transition-all focus:border-slate-400 focus:shadow-2xl focus:shadow-slate-200/50"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <kbd className="hidden rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-400 border border-slate-200 sm:block">⌘K</kbd>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3">
                <FilterButton icon={Database} label="Source System" count="4" />
                <FilterButton icon={Activity} label="Message Type" count="12" />
                <FilterButton icon={Globe} label="Region" />
                <FilterButton icon={Calendar} label="Time Range" active />
                
                <div className="h-8 w-px bg-slate-200 mx-2" />
                
                <div className="flex gap-2">
                    {['Processing', 'Failed', 'Queued', 'Delivered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                            className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border ${
                                statusFilter === status
                                ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                                : status === 'Failed' 
                                ? 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' 
                                : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FilterButton({ icon: Icon, label, count, active }: { icon: LucideIcon, label: string, count?: string, active?: boolean }) {
    return (
        <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                active 
                ? 'border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-950/20' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-lg'
            }`}
        >
            <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-400'}`} />
            {label}
            {count && (
                <span className={`ml-1 rounded-md px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                </span>
            )}
        </motion.button>
    );
}


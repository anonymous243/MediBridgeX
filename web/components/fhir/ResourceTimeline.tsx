'use client';

import { mockClinicalTimeline } from '@/data/fhir-mock';
import { 
    Activity, 
    Calendar, 
    Clock, 
    Stethoscope, 
    Pill, 
    FileText,
    History,
    ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
    Observation: Stethoscope,
    Encounter: Activity,
    Medication: Pill,
    Procedure: FileText,
    Patient: History,
};

export function ResourceTimeline() {
    return (
        <div className="relative space-y-10 pl-10 pt-4">
            {/* Thread Line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />

            {mockClinicalTimeline.map((event, i) => {
                const Icon = iconMap[event.type as keyof typeof iconMap] || Activity;
                
                return (
                    <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                    >
                        {/* Event Marker */}
                        <div className="absolute -left-10 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white bg-slate-950 text-white shadow-xl">
                            <Icon className="h-4 w-4" />
                        </div>

                        <div className="group relative flex flex-col gap-3 rounded-[32px] border border-slate-100 bg-white p-7 transition-all duration-500 hover:border-slate-200 hover:shadow-2xl hover:-translate-y-1">
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-50/0 via-transparent to-pink-50/0 opacity-0 transition-opacity group-hover:opacity-100" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            {event.type}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${event.status === 'Failed' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                                        <Calendar className="h-3 w-3" />
                                        {event.date}
                                    </div>
                                </div>
                                
                                <h4 className="text-lg font-black tracking-tight text-slate-950">
                                    {event.description}
                                </h4>
                                
                                <div className="mt-4 flex items-center gap-4">
                                    {event.provider && (
                                        <div className="flex items-center gap-2 rounded-xl bg-blue-50/50 px-3 py-2 border border-blue-100/50">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <p className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                                                {event.provider}
                                            </p>
                                        </div>
                                    )}
                                    {event.severity && (
                                        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${event.severity === 'high' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                            <ShieldAlert className="h-3 w-3" />
                                            <p className="text-[11px] font-black uppercase tracking-wider">
                                                {event.severity} Priority
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

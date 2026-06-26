'use client';

import { motion } from 'framer-motion';
import { 
    Download, 
    ShieldCheck, 
    RefreshCcw, 
    Zap, 
    Webhook, 
    AlertTriangle,
    PlusCircle
} from 'lucide-react';
import { format } from 'date-fns';

const activities = [
    {
        id: '1',
        type: 'received',
        title: 'New Message Ingested',
        details: 'ADT^A01 from Epic OMR',
        time: new Date(),
        icon: PlusCircle,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        id: '2',
        type: 'validation',
        title: 'Validation Success',
        details: 'MSG-99281 scored 100%',
        time: new Date(Date.now() - 1000 * 60 * 2),
        icon: ShieldCheck,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        id: '3',
        type: 'retry',
        title: 'Retry Triggered',
        details: 'MSG-99284 attempt #3',
        time: new Date(Date.now() - 1000 * 60 * 5),
        icon: RefreshCcw,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        id: '4',
        type: 'transformation',
        title: 'Transformation Done',
        details: 'HL7 to FHIR in 89ms',
        time: new Date(Date.now() - 1000 * 60 * 8),
        icon: Zap,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        id: '5',
        type: 'webhook',
        title: 'Webhook Delivered',
        details: 'Target: St. Anthony Health',
        time: new Date(Date.now() - 1000 * 60 * 12),
        icon: Webhook,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10'
    },
    {
        id: '6',
        type: 'alert',
        title: 'Queue Spike Alert',
        details: 'Backlog > 10,000 msgs',
        time: new Date(Date.now() - 1000 * 60 * 20),
        icon: AlertTriangle,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    }
];

export function ActivityFeed() {
    return (
        <div className="flex h-full flex-col bg-white border-l border-slate-200">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-950">Live Pipeline</h3>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="relative space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100" />

                    {activities.map((activity, i) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative flex gap-4"
                        >
                            <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${activity.bg} border-4 border-white shadow-sm`}>
                                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                            </div>
                            <div className="flex flex-col gap-1 pt-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {format(activity.time, 'HH:mm:ss')}
                                </p>
                                <h4 className="text-xs font-black text-slate-950">{activity.title}</h4>
                                <p className="text-xs font-medium text-slate-500">{activity.details}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="p-8 border-t border-slate-100">
                <button className="w-full rounded-2xl bg-slate-50 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 transition hover:bg-slate-100">
                    View Full Audit Log
                </button>
            </div>
        </div>
    );
}

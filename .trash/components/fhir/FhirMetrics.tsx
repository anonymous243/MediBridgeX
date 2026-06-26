'use client';

import { Activity, Clock, Zap, AlertCircle, Server, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const metrics = [
    {
        title: 'Sync Latency',
        value: '142ms',
        trend: '-12ms',
        icon: Clock,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        title: 'FHIR Throughput',
        value: '2.4k',
        sub: 'msgs/sec',
        trend: '+15%',
        icon: Zap,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10'
    },
    {
        title: 'Validation Health',
        value: '99.98%',
        trend: '+0.01%',
        icon: Activity,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        title: 'Queue Status',
        value: '12',
        sub: 'pending',
        trend: 'Low',
        icon: Server,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    }
];

export function FhirMetrics() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, i) => (
                <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-sm transition-all duration-500 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-1"
                >
                    {/* Background Shine */}
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100 blur-3xl" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${metric.bg} shadow-inner`}>
                                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${metric.trend.startsWith('+') || metric.trend.startsWith('-') && metric.title.includes('Latency') ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {metric.trend}
                                </span>
                                <div className="mt-1 flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((dot) => (
                                        <div key={dot} className={`h-1 w-1 rounded-full ${dot <= 4 ? metric.color.replace('text', 'bg') : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{metric.title}</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-3xl font-black tracking-tight text-slate-950">
                                    {metric.value}
                                </h3>
                                {metric.sub && (
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {metric.sub}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Animated Border Gradient */}
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-50 overflow-hidden">
                        <motion.div 
                            className={`h-full ${metric.color.replace('text', 'bg')}`}
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

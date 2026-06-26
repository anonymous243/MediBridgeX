'use client';

import { useEffect } from 'react';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { PipelineMetrics } from '@/components/messages/PipelineMetrics';
import { MessageFilters } from '@/components/messages/MessageFilters';
import { MessageStream } from '@/components/messages/MessageStream';
import { MessageDrawer } from '@/components/messages/MessageDrawer';
import { ActivityFeed } from '@/components/messages/ActivityFeed';
import { 
    Activity, 
    Plus, 
    Download,
    Filter,
    ShieldCheck,
    Webhook,
    RefreshCcw,
    Zap,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMessageStore } from '@/stores/useMessageStore';

import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';
import { PermissionGuard } from '@/components/dashboard/PermissionGuard';

export default function MessagesPage() {
    const { 
        messages, 
        selectedMessage, 
        isLoading, 
        fetchMessages, 
        fetchMetrics, 
        fetchActivities,
        selectMessage 
    } = useMessageStore();

    useEffect(() => {
        fetchMessages();
        fetchMetrics();
        fetchActivities();
        
        // Polling for metrics simulation
        const interval = setInterval(() => {
            fetchMetrics();
            fetchActivities();
        }, 10000);
        return () => clearInterval(interval);
    }, [fetchMessages, fetchMetrics, fetchActivities]);


    return (
        <ProtectedRoute requiredPermissions={['view:messages']}>
            <div className="flex h-[calc(100vh-120px)] overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-12 custom-scrollbar">
                    <div className="mx-auto max-w-7xl space-y-12">
                        {/* Header */}
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <SectionHeader
                                title="Interoperability Pipeline"
                                description="Monitor and troubleshoot real-time HL7 to FHIR message transformations."
                            />
                            
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 hover:shadow-lg">
                                    <Download className="h-4 w-4" />
                                    Export History
                                </button>
                                <PermissionGuard requiredPermissions={['retry:messages']}>
                                    <button className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white transition hover:opacity-90 hover:shadow-2xl hover:shadow-slate-950/20 active:scale-95">
                                        <Plus className="h-4 w-4" />
                                        Ingest Manually
                                    </button>
                                </PermissionGuard>
                            </div>
                        </div>

                        {/* Metrics Dashboard */}
                        <PipelineMetrics />

                        {/* Operational View */}
                        <div className="space-y-10">
                            {/* Search & Filter */}
                            <SectionCard className="border-none shadow-none bg-transparent p-0 hover:translate-y-0">
                                <MessageFilters />
                            </SectionCard>

                            {/* Message Stream Table */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-2xl font-black tracking-tighter text-slate-950">Message Stream</h2>
                                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Activity</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Zap className="h-3 w-3" />
                                            89 ms latency
                                        </div>
                                        <div className="h-4 w-px bg-slate-200" />
                                        <button className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 transition">
                                            <Filter className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <MessageStream onMessageClick={(msg) => selectMessage(msg.id)} />
                                </motion.div>
                            </div>
                        </div>

                        {/* Regional Health Footer Section */}
                        <div className="grid gap-8 lg:grid-cols-3">
                            <HealthCard region="US-EAST" status="healthy" />
                            <HealthCard region="US-WEST" status="healthy" />
                            <HealthCard region="EU-CENTRAL" status="degraded" />
                        </div>
                    </div>
                </div>

                {/* Sidebar Activity Feed */}
                <div className="hidden w-[400px] shrink-0 xl:block">
                    <ActivityFeed />
                </div>

                {/* Message Drawer */}
                <MessageDrawer
                    message={selectedMessage}
                    open={!!selectedMessage}
                    onClose={() => selectMessage(null)}
                />
            </div>
        </ProtectedRoute>
    );
}

function HealthCard({ region, status }: { region: string, status: 'healthy' | 'degraded' | 'down' }) {
    return (
        <SectionCard className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                        status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                        status === 'degraded' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'
                    }`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{region} Pipeline</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                    status === 'healthy' ? 'text-emerald-600' : 
                    status === 'degraded' ? 'text-amber-600' : 'text-rose-600'
                }`}>
                    {status}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-black text-slate-950">99.9% Uptime</p>
                    <p className="text-[10px] font-bold text-slate-400">Past 24 hours</p>
                </div>
                <div className="flex gap-0.5">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={`h-6 w-1 rounded-full ${i === 15 && status === 'degraded' ? 'bg-amber-400' : 'bg-emerald-400/30'}`} />
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Copy, Download, History, ShieldCheck, Zap, Server, Activity, Database, Clock, RefreshCcw, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Message } from '../../types/message';
import { HL7Viewer } from './HL7Viewer';
import { FHIRViewer } from './FHIRViewer';
import { format } from 'date-fns';

interface MessageDrawerProps {
    message: Message | null;
    open: boolean;
    onClose: () => void;
}

type Tab = 'transformation' | 'metadata' | 'pipeline' | 'validation' | 'audit';

export function MessageDrawer({ message, open, onClose }: MessageDrawerProps) {
    const [activeTab, setActiveTab] = useState<Tab>('transformation');

    if (!message) return null;

    const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
        { id: 'transformation', label: 'Transformation', icon: Zap },
        { id: 'metadata', label: 'Metadata', icon: Database },
        { id: 'pipeline', label: 'Pipeline History', icon: History },
        { id: 'validation', label: 'Validation', icon: ShieldCheck },
        { id: 'audit', label: 'Audit Logs', icon: Clock },
    ];

    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 right-0 z-50 w-full lg:max-w-4xl border-l border-slate-200 bg-white shadow-2xl focus:outline-none"
                                role="dialog"
                                aria-modal="true"
                            >
                                <div className="flex h-full flex-col">
                                    {/* Header */}
                                    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 lg:px-8 py-5 lg:py-6">
                                        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
                                            <div className="flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-slate-950 text-white shadow-xl shrink-0">
                                                <Activity className="h-5 w-5 lg:h-7 lg:w-7" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 lg:gap-1 min-w-0">
                                                <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                                                    <Dialog.Title className="text-lg lg:text-2xl font-black tracking-tight text-slate-950 truncate">
                                                        {message.id}
                                                    </Dialog.Title>
                                                    <span className="rounded-full bg-blue-50 px-2 lg:px-3 py-0.5 lg:py-1 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-700 border border-blue-100 whitespace-nowrap">
                                                        {message.correlationId}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 lg:gap-4 text-[10px] lg:text-xs font-bold text-slate-500 overflow-x-auto whitespace-nowrap no-scrollbar">
                                                    <span className="flex items-center gap-1.5 shrink-0"><Database className="h-3.5 w-3.5" /> {message.sourceSystem}</span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                                                    <span className="flex items-center gap-1.5 shrink-0"><Zap className="h-3.5 w-3.5" /> {message.messageType}</span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                                                    <span className="shrink-0">{format(new Date(message.timestamp), 'MMM dd, HH:mm:ss.SSS')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                                            <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-slate-200">
                                                <button className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 lg:px-5 py-2.5 lg:py-3 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition hover:opacity-90 active:scale-95">
                                                    <RefreshCcw className="h-3.5 w-3.5" />
                                                    Retry
                                                </button>
                                                <button 
                                                    aria-label="Download message"
                                                    className="rounded-xl border border-slate-200 bg-white p-2.5 lg:p-3 text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <Dialog.Close 
                                                aria-label="Close drawer"
                                                className="rounded-full p-2 lg:p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                                            >
                                                <X className="h-5 w-5 lg:h-6 lg:w-6" />
                                            </Dialog.Close>
                                        </div>
                                    </div>

                                    {/* Mobile Actions (Sticky below header) */}
                                    <div className="flex sm:hidden items-center gap-2 border-b border-slate-200 bg-white px-6 py-3">
                                        <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-slate-950 py-2.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
                                            <RefreshCcw className="h-3 w-3" />
                                            Retry Delivery
                                        </button>
                                        <button className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600">
                                            <Download className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-6 lg:px-8 overflow-x-auto no-scrollbar">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`relative flex items-center gap-2 px-3 lg:px-4 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                                                    activeTab === tab.id ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                            >
                                                <tab.icon className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${activeTab === tab.id ? 'text-slate-950' : 'text-slate-300'}`} />
                                                {tab.label}
                                                {activeTab === tab.id && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-950"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 overflow-auto p-6 lg:p-8 bg-slate-50/30">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'transformation' && (
                                                <motion.div
                                                    key="transformation"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-full"
                                                >
                                                    <HL7Viewer payload={message.rawPayload} />
                                                    <FHIRViewer json={message.transformedPayload} latency={89} score={message.validationResults.score} />
                                                </motion.div>
                                            )}

                                            {activeTab === 'pipeline' && (
                                                <motion.div
                                                    key="pipeline"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="max-w-3xl space-y-6 lg:space-y-8"
                                                >
                                                    <h3 className="text-base lg:text-lg font-black tracking-tight text-slate-950">Execution Pipeline</h3>
                                                    <div className="relative space-y-6">
                                                        <div className="absolute left-5 lg:left-6 top-2 bottom-2 w-px bg-slate-200" />
                                                        {message.pipelineHistory.map((step, i) => (
                                                            <div key={step.id} className="relative flex gap-4 lg:gap-6">
                                                                <div className={`relative z-10 flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl border-4 border-white shadow-sm shrink-0 ${
                                                                    step.status === 'success' ? 'bg-emerald-500 text-white' : 
                                                                    step.status === 'failure' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white animate-pulse'
                                                                }`}>
                                                                    {step.status === 'success' ? <Zap className="h-4 w-4 lg:h-5 lg:w-5" /> : 
                                                                     step.status === 'failure' ? <X className="h-4 w-4 lg:h-5 lg:w-5" /> : <Activity className="h-4 w-4 lg:h-5 lg:w-5" />}
                                                                </div>
                                                                <div className="flex flex-1 flex-col gap-1 pt-1 min-w-0">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <h4 className="text-sm font-black text-slate-950 truncate">{step.name}</h4>
                                                                        <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 whitespace-nowrap">{format(new Date(step.timestamp), 'HH:mm:ss.SSS')}</span>
                                                                    </div>
                                                                    {step.durationMs && (
                                                                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Duration: {step.durationMs}ms</span>
                                                                    )}
                                                                    {step.details && (
                                                                        <p className="mt-2 rounded-xl bg-slate-100 p-4 text-xs font-medium text-slate-600 border border-slate-200 leading-relaxed">
                                                                            {step.details}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'metadata' && (
                                                <motion.div
                                                    key="metadata"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
                                                >
                                                    <div className="space-y-4 lg:space-y-6">
                                                        <h3 className="text-base lg:text-lg font-black tracking-tight text-slate-950">System Metadata</h3>
                                                        <div className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 space-y-4 lg:space-y-6">
                                                            <MetadataRow label="Facility Name" value={message.metadata.facility} />
                                                            <MetadataRow label="Department" value={message.metadata.department} />
                                                            <MetadataRow label="Environment" value={message.metadata.env || 'Production'} />
                                                            <MetadataRow label="Message Region" value={message.region} />
                                                            <MetadataRow label="Patient Target" value={message.patientName} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 lg:space-y-6">
                                                        <h3 className="text-base lg:text-lg font-black tracking-tight text-slate-950">Interoperability Tags</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['PROD', 'HIPAA-OK', 'ENCRYPTED', 'PII-REDACTED', 'AUDITED'].map(tag => (
                                                                <span key={tag} className="rounded-full bg-slate-100 px-3 lg:px-4 py-1.5 lg:py-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}

function MetadataRow({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 lg:pb-4 last:border-0 last:pb-0 gap-4">
            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{label}</span>
            <span className="text-[11px] lg:text-xs font-black text-slate-950 text-right truncate">{value || 'N/A'}</span>
        </div>
    );
}

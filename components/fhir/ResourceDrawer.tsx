'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { 
    X, 
    Database, 
    User, 
    Activity, 
    Clock,
    CheckCircle2,
    AlertCircle,
    Info,
    History,
    Link2,
    ClipboardList,
    Server,
    ShieldCheck,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FhirResource } from '@/types/fhir';
import { useState } from 'react';
import { JsonViewer } from './JsonViewer';
import { ResourceTimeline } from './ResourceTimeline';

interface ResourceDrawerProps {
    resource: FhirResource | null;
    open: boolean;
    onClose: () => void;
}

type Tab = 'Overview' | 'JSON View' | 'Timeline' | 'Relationships' | 'Audit Logs';

export function ResourceDrawer({ resource, open, onClose }: ResourceDrawerProps) {
    const [activeTab, setActiveTab] = useState<Tab>('Overview');

    if (!resource) return null;

    const tabs: Tab[] = ['Overview', 'JSON View', 'Timeline', 'Relationships', 'Audit Logs'];

    return (
        <Dialog.Root open={open} onOpenChange={(val) => !val && onClose()}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-sm"
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 right-0 top-0 z-50 w-full lg:max-w-3xl bg-white shadow-2xl focus:outline-none flex flex-col"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="drawer-title"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 lg:px-10 py-5 lg:py-8">
                                    <div className="flex items-center gap-4 lg:gap-6">
                                        <div className="flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-slate-950 text-white shadow-xl">
                                            <Database className="h-5 w-5 lg:h-7 lg:w-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                                                <h2 id="drawer-title" className="text-lg lg:text-2xl font-black tracking-tight text-slate-950 truncate">
                                                    {resource.resourceType}
                                                </h2>

                                                <span className="rounded-full bg-blue-100 px-2 lg:px-3 py-0.5 lg:py-1 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-700 whitespace-nowrap">
                                                    R4 Release
                                                </span>
                                            </div>
                                            <p className="mt-0.5 lg:mt-1 text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">{resource.id}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={onClose}
                                        aria-label="Close drawer"
                                        className="rounded-xl lg:rounded-2xl p-2 lg:p-3 hover:bg-slate-200 transition-colors shrink-0"
                                    >
                                        <X className="h-5 w-5 lg:h-7 lg:w-7 text-slate-400" />
                                    </button>
                                </div>

                                {/* Tabs Navigation */}
                                <div className="flex gap-6 lg:gap-10 border-b border-slate-100 px-6 lg:px-10 overflow-x-auto whitespace-nowrap bg-white sticky top-0 z-10 scrollbar-hide">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative py-4 lg:py-5 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition ${activeTab === tab ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 h-1 w-full bg-slate-950" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
                                    {activeTab === 'Overview' && (
                                        <div className="space-y-8 lg:space-y-12">
                                            {/* Resource Health */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                                <div className="rounded-[24px] lg:rounded-[32px] border border-slate-100 bg-slate-50 p-6 lg:p-8">
                                                    <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-400">Sync Status</h3>
                                                    <div className="mt-3 lg:mt-4 flex items-center gap-3">
                                                        {resource.status === 'Failed' ? <AlertCircle className="h-5 w-5 lg:h-6 lg:w-6 text-rose-500" /> : <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-500" />}
                                                        <span className="text-lg lg:text-xl font-black text-slate-950">{resource.status}</span>
                                                    </div>
                                                </div>
                                                <div className="rounded-[24px] lg:rounded-[32px] border border-slate-100 bg-slate-50 p-6 lg:p-8">
                                                    <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-400">Validation</h3>
                                                    <div className="mt-3 lg:mt-4 flex items-center gap-3">
                                                        <div className="text-lg lg:text-xl font-black text-slate-950">{resource.validationScore}%</div>
                                                        <div className="h-1.5 lg:h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full transition-all duration-1000 ${resource.validationScore > 80 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                                                style={{ width: `${resource.validationScore}%` }} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Clinical Data */}
                                            <div className="space-y-4 lg:space-y-6">
                                                <h3 className="flex items-center gap-3 text-xs lg:text-sm font-black uppercase tracking-widest text-slate-950">
                                                    <User className="h-4 w-4" /> Identity Context
                                                </h3>
                                                <div className="grid gap-3 lg:gap-4 rounded-[24px] lg:rounded-[32px] border border-slate-100 p-6 lg:p-8">
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-xs lg:text-sm font-bold text-slate-400 whitespace-nowrap">Patient Name</span>
                                                        <span className="text-xs lg:text-sm font-black text-slate-950 text-right truncate">{resource.patientName || 'Global'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-xs lg:text-sm font-bold text-slate-400 whitespace-nowrap">MRN Registry</span>
                                                        <span className="text-xs lg:text-sm font-black text-slate-950 text-right truncate">{resource.mrn || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-xs lg:text-sm font-bold text-slate-400 whitespace-nowrap">Data Region</span>
                                                        <span className="text-xs lg:text-sm font-black text-slate-950 text-right truncate">{resource.region}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Issues */}
                                            {resource.validationIssues.length > 0 && (
                                                <div className="space-y-4 lg:space-y-6">
                                                    <h3 className="flex items-center gap-3 text-xs lg:text-sm font-black uppercase tracking-widest text-rose-600">
                                                        <ShieldCheck className="h-4 w-4" /> Validation Alerts
                                                    </h3>
                                                    <div className="space-y-3 lg:space-y-4">
                                                        {resource.validationIssues.map((issue, i) => (
                                                            <div key={i} className="flex gap-4 rounded-2xl lg:rounded-3xl border border-rose-100 bg-rose-50/30 p-5 lg:p-6">
                                                                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <p className="text-xs lg:text-sm font-black text-rose-950 uppercase tracking-tight truncate">{issue.code}</p>
                                                                    <p className="mt-1 text-xs lg:text-sm font-medium text-rose-700/80 leading-relaxed">{issue.details}</p>
                                                                    {issue.location && (
                                                                        <code className="mt-3 block text-[9px] lg:text-[10px] font-bold text-rose-400 bg-white/50 px-2 py-1 rounded truncate">
                                                                            {issue.location}
                                                                        </code>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'JSON View' && (
                                        <div className="h-full -mx-6 lg:-mx-10">
                                            <JsonViewer data={resource.json} filename={`${resource.resourceType}-${resource.id}.json`} />
                                        </div>
                                    )}

                                    {activeTab === 'Timeline' && (
                                        <ResourceTimeline />
                                    )}

                                    {activeTab === 'Relationships' && (
                                        <div className="space-y-4 lg:space-y-6">
                                            {resource.relationships.map((rel, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-2xl lg:rounded-3xl border border-slate-100 p-5 lg:p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors shrink-0">
                                                            <Link2 className="h-4 w-4 lg:h-5 lg:w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">{rel.type}</p>
                                                            <p className="text-xs lg:text-sm font-black text-slate-900 truncate">{rel.targetType} / {rel.targetId}</p>
                                                        </div>
                                                    </div>
                                                    <div className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white transition shadow-sm shrink-0">
                                                        <History className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'Audit Logs' && (
                                        <div className="space-y-3 lg:space-y-4">
                                            {resource.auditLogs.map((log) => (
                                                <div key={log.id} className="flex items-center gap-4 lg:gap-6 rounded-2xl lg:rounded-3xl border border-slate-50 p-5 lg:p-6">
                                                    <div className={`h-9 w-9 lg:h-10 lg:w-10 rounded-xl flex items-center justify-center shrink-0 ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                                        <Server className="h-4 w-4 lg:h-5 lg:w-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-950 truncate">{log.action}</p>
                                                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{log.timestamp}</p>
                                                        </div>
                                                        <p className="mt-1 text-xs lg:text-sm font-bold text-slate-500 truncate">Actor: <span className="text-slate-900">{log.actor}</span></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="border-t border-slate-100 bg-slate-50/50 px-6 lg:px-10 py-6 lg:py-8">
                                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                                        <button className="flex-1 rounded-xl lg:rounded-2xl bg-slate-950 py-3.5 lg:py-4 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90 active:scale-[0.98] shadow-xl">
                                            Request Re-Validation
                                        </button>
                                        <div className="flex gap-3 lg:gap-4">
                                            <button 
                                                aria-label="Download Complete Record"
                                                className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 h-12 lg:h-14 rounded-xl lg:rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50 active:scale-[0.98] shadow-md shrink-0 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em]"
                                            >
                                                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export JSON</span>
                                                <span className="sm:hidden">Export</span>
                                            </button>
                                            <button 
                                                aria-label="Add to clipboard"
                                                className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50 active:scale-[0.98] shadow-md shrink-0"
                                            >
                                                <ClipboardList className="h-5 w-5 lg:h-6 lg:w-6" />
                                            </button>
                                        </div>
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

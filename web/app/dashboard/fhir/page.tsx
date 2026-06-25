'use client';

import { useEffect } from 'react';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { FhirMetrics } from '@/components/fhir/FhirMetrics';
import { ResourceFilters } from '@/components/fhir/ResourceFilters';
import { ResourceTable } from '@/components/fhir/ResourceTable';
import { ResourceDrawer } from '@/components/fhir/ResourceDrawer';
import { 
    Database, 
    Search, 
    Activity, 
    ShieldCheck, 
    Plus, 
    Download,
    Filter,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useFhirStore } from '@/stores/useFhirStore';

import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';
import { PermissionGuard } from '@/components/dashboard/PermissionGuard';

export default function FhirPage() {
    const { 
        resources, 
        selectedResource, 
        isDrawerOpen, 
        isLoading, 
        fetchResources, 
        selectResource, 
        closeDrawer 
    } = useFhirStore();

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    return (
        <ProtectedRoute requiredPermissions={['view:fhir']}>
            <div className="space-y-12 pb-24">
                {/* Header with Actions */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeader
                        title="FHIR Interoperability Workspace"
                        description="Enterprise-grade resource management, validation monitoring, and clinical data inspection."
                    />
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 hover:shadow-lg">
                            <Download className="h-4 w-4" />
                            Export Batch
                        </button>
                        <PermissionGuard requiredRoles={['admin', 'developer', 'super_admin']}>
                            <button className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white transition hover:opacity-90 hover:shadow-2xl hover:shadow-slate-950/20 active:scale-95">
                                <Plus className="h-4 w-4" />
                                New Resource
                            </button>
                        </PermissionGuard>
                    </div>
                </div>

                {/* Metrics Dashboard */}
                <FhirMetrics />

                {/* Main Operational View */}
                <div className="space-y-10">
                    {/* Advanced Search & Filtering */}
                    <SectionCard className="border-none shadow-none bg-transparent p-0 hover:translate-y-0">
                        <div className="mb-6 flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                    <Search className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight text-slate-950">Resource Query Builder</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-700 border border-blue-100">
                                    <Activity className="h-3 w-3" />
                                    Real-time Feed
                                </span>
                            </div>
                        </div>
                        <ResourceFilters />
                    </SectionCard>

                    {/* Resource Table Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black tracking-tighter text-slate-950">Active FHIR Resources</h2>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                ) : (
                                    <p className="text-sm font-bold text-slate-400">Showing {resources.length} total resources across all regions</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 transition">
                                    <Filter className="h-5 w-5" />
                                </button>
                                <div className="h-6 w-px bg-slate-200 mx-2" />
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                                            {i === 3 ? '+8' : 'JS'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* The Table */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ResourceTable onResourceClick={(res) => selectResource(res.id)} />
                        </motion.div>
                    </div>
                </div>

                {/* Sidebar Inspector / Quick Actions (Optional Future Enhancement) */}
                <div className="grid gap-8 lg:grid-cols-2">
                    <SectionCard>
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            <h3 className="text-lg font-black tracking-tight text-slate-950">Auto-Validation Health</h3>
                        </div>
                        <div className="space-y-6">
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                MediBridgeX is automatically validating incoming resources against **HL7 FHIR R4** standards. 
                                Currently processing **1,420 resources/hr** with a **99.9%** schema compliance rate.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex-1 rounded-2xl bg-slate-50 p-6 border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Schema Versions</p>
                                    <p className="mt-2 text-xl font-black text-slate-950">v4.0.1 (Base)</p>
                                </div>
                                <div className="flex-1 rounded-2xl bg-slate-50 p-6 border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Coverage</p>
                                    <p className="mt-2 text-xl font-black text-slate-950">92.4%</p>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard className="bg-slate-950 text-white border-none shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Database className="h-5 w-5 text-blue-400" />
                            <h3 className="text-lg font-black tracking-tight">Sync Infrastructure</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-400">Epic OMR Gateway</p>
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-400">Cerner Millennium Hub</p>
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-400">Azure Health API</p>
                                <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                            </div>
                            <button className="mt-4 w-full rounded-2xl bg-white/10 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/20">
                                Configure Endpoints
                            </button>
                        </div>
                    </SectionCard>
                </div>

                {/* Resource Drawer - The Right Side Enterprise Inspector */}
                <ResourceDrawer
                    resource={selectedResource}
                    open={isDrawerOpen}
                    onClose={closeDrawer}
                />
            </div>
        </ProtectedRoute>
    );
}
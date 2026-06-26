'use client';

import { 
    FileJson, 
    CheckCircle2,
    Clock,
    AlertCircle,
    Activity,
    MapPin,
    ShieldCheck,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { mockFhirResources } from '@/data/fhir-mock';
import { FhirResource, FhirResourceType } from '@/types/fhir';
import { format } from 'date-fns';
import { ValidationBadge } from './ValidationBadge';
import { DataTable } from '@/components/tables/DataTable';

const typeColors: Record<FhirResourceType, string> = {
    Patient: 'bg-blue-50 text-blue-700 border-blue-100',
    Observation: 'bg-pink-50 text-pink-700 border-pink-100',
    Encounter: 'bg-purple-50 text-purple-700 border-purple-100',
    Condition: 'bg-amber-50 text-amber-700 border-amber-100',
    Procedure: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    MedicationRequest: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    DiagnosticReport: 'bg-rose-50 text-rose-700 border-rose-100',
};

const statusIcons = {
    Validated: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    Processed: <Activity className="h-3.5 w-3.5 text-blue-500" />,
    Queued: <Clock className="h-3.5 w-3.5 text-amber-500" />,
    Failed: <AlertCircle className="h-3.5 w-3.5 text-rose-500" />,
    Partial: <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />,
};

interface ResourceTableProps {
    onResourceClick: (resource: FhirResource) => void;
}

export function ResourceTable({ onResourceClick }: ResourceTableProps) {
    const columns = [
        {
            key: 'resourceType',
            header: 'Resource',
            render: (_: any, resource: FhirResource) => (
                <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${typeColors[resource.resourceType].split(' ')[2]} ${typeColors[resource.resourceType].split(' ')[0]}`}>
                        <FileJson className="h-5 w-5" />
                    </div>
                    <div>
                        <span className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${typeColors[resource.resourceType]}`}>
                            {resource.resourceType}
                        </span>
                        <p className="mt-1 text-sm font-black tracking-tight text-slate-900">{resource.id}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'patientName',
            header: 'Patient / Subject',
            render: (value: string, resource: FhirResource) => (
                value ? (
                    <div>
                        <p className="text-sm font-black text-slate-900">{value}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{resource.mrn || resource.patientId}</p>
                    </div>
                ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Infrastructure</span>
                )
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (value: keyof typeof statusIcons) => (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-white px-2.5 py-1 shadow-sm">
                        {statusIcons[value]}
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">{value}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'validationScore',
            header: 'Validation',
            className: 'hidden lg:block',
            render: (value: number) => <ValidationBadge score={value} />
        },
        {
            key: 'lastUpdated',
            header: 'Last Updated',
            className: 'text-right',
            render: (value: string) => (
                <div>
                    <p className="text-sm font-black text-slate-900">
                        {format(new Date(value), 'MMM d, HH:mm')}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">UTC-0</p>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <DataTable 
                columns={columns}
                data={mockFhirResources as any[]}
                onRowClick={onResourceClick}
                className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-2xl"
                emptyState={{
                    icon: FileJson,
                    title: "No FHIR resources found",
                    description: "Adjust your filters or sync with your EHR to see clinical data."
                }}
            />

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between rounded-[32px] border border-slate-200 bg-white/50 backdrop-blur-md px-6 py-5 md:px-8 gap-4">
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                        Showing <span className="text-slate-950">1-3</span> of <span className="text-slate-950">142</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Per page</label>
                        <select 
                            aria-label="Rows per page"
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold outline-none"
                        >
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <button 
                        aria-label="Previous page"
                        className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed" 
                        disabled
                    >
                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <div className="flex gap-1">
                        <button aria-label="Page 1" className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-slate-950 text-[10px] md:text-xs font-black text-white">1</button>
                        <button aria-label="Page 2" className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white border border-slate-200 text-[10px] md:text-xs font-black text-slate-600 hover:bg-slate-50">2</button>
                    </div>
                    <button 
                        aria-label="Next page"
                        className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
                    >
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}


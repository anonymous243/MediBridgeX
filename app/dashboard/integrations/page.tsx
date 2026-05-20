import {
    Activity,
    ArrowUpRight,
    Database,
    Link2,
    ShieldCheck,
    Key,
    Webhook,
    Copy,
    Trash2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';

import { MetricCard } from '@/components/cards/MetricCard';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SectionCard } from '@/components/dashboard/SectionCard';

const integrations = [
    {
        name: 'Epic EHR',
        type: 'HL7 v2',
        status: 'Connected',
        throughput: '12.4K msgs/hr',
    },
    {
        name: 'Cerner',
        type: 'FHIR R4',
        status: 'Connected',
        throughput: '8.9K msgs/hr',
    },
    {
        name: 'LabCorp',
        type: 'HL7 ORU',
        status: 'Processing',
        throughput: '3.1K msgs/hr',
    },
    {
        name: 'Radiology PACS',
        type: 'DICOM + HL7',
        status: 'Connected',
        throughput: '1.2K msgs/hr',
    },
];

const apiKeys = [
    { name: 'Production Backend Server', key: 'sk_live_••••••••e9f4', created: 'Oct 12, 2025', lastUsed: '2 mins ago' },
    { name: 'Analytics Service', key: 'sk_live_••••••••2b8a', created: 'Nov 04, 2025', lastUsed: '1 hour ago' },
];

const webhooks = [
    { name: 'Patient Admissions', url: 'https://api.hospital-a.com/webhooks/admission', events: 'Patient.create, Encounter.update', status: 'Active' },
    { name: 'Lab Results Alerts', url: 'https://pacs.radiology-dept.local/webhook', events: 'Observation.create', status: 'Failing' },
];


const metrics = [
    {
        title: 'Connected Systems',
        value: '148',
        icon: Link2,
        color: 'text-pink-500',
    },
    {
        title: 'Live Pipelines',
        value: '82',
        icon: Activity,
        color: 'text-blue-500',
    },
    {
        title: 'FHIR Gateways',
        value: '24',
        icon: Database,
        color: 'text-purple-500',
    },
    {
        title: 'Secure Channels',
        value: '99.99%',
        icon: ShieldCheck,
        color: 'text-emerald-500',
    },
];

import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';

export default function IntegrationsPage() {
    return (
        <ProtectedRoute requiredPermissions={['manage:settings']}>
            <div className="space-y-10">
                {/* HEADER */}
                <SectionHeader
                    title="Healthcare Integrations"
                    description="Manage hospital systems, interoperability pipelines, and real-time healthcare connectivity."
                />

                {/* METRICS */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <MetricCard
                            key={metric.title}
                            title={metric.title}
                            value={metric.value}
                            icon={metric.icon}
                            color={metric.color}
                        />
                    ))}
                </div>

                {/* SYSTEMS */}
                <SectionCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                                Connected Systems
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Active healthcare interoperability integrations.
                            </p>
                        </div>

                        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:opacity-95">
                            Add Integration
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="mt-10 space-y-5">
                        {integrations.map((integration) => (
                            <div
                                key={integration.name}
                                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-8 py-6"
                            >
                                {/* LEFT */}
                                <div className="flex items-center gap-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100">
                                        <Database className="h-7 w-7 text-blue-600" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                                            {integration.name}
                                        </h3>

                                        <p className="mt-2 text-sm font-semibold text-slate-500">
                                            {integration.type}
                                        </p>
                                    </div>
                                </div>

                                {/* CENTER */}
                                <div>
                                    <p className="text-sm font-semibold text-slate-400">
                                        Throughput
                                    </p>

                                    <p className="mt-2 text-lg font-bold text-slate-800">
                                        {integration.throughput}
                                    </p>
                                </div>

                                {/* STATUS */}
                                <div className="flex items-center gap-4">
                                    <span className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-bold text-emerald-700">
                                        {integration.status}
                                    </span>

                                    <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-100">
                                        <ArrowUpRight className="h-5 w-5 text-slate-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* API KEYS */}
                <SectionCard>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 flex items-center gap-3">
                                <Key className="h-6 w-6 text-slate-400" />
                                API Keys
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Manage programmatic access to the MediBridgeX platform.
                            </p>
                        </div>
                        <button className="rounded-2xl border-2 border-slate-950 bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95 shadow-md self-start sm:self-auto">
                            Generate New Key
                        </button>
                    </div>

                    <div className="mt-8 space-y-4">
                        {apiKeys.map((item) => (
                            <div key={item.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-black text-slate-950 truncate">{item.name}</h3>
                                    <div className="mt-2 flex items-center gap-3">
                                        <code className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 tracking-wider">
                                            {item.key}
                                        </code>
                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 transition" aria-label="Copy key">
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
                                    <div className="hidden sm:block">
                                        <p className="uppercase tracking-widest text-slate-400 text-[10px]">Created</p>
                                        <p className="mt-1 text-slate-800">{item.created}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="uppercase tracking-widest text-slate-400 text-[10px]">Last Used</p>
                                        <p className="mt-1 text-slate-800">{item.lastUsed}</p>
                                    </div>
                                    <button className="ml-auto md:ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* WEBHOOKS */}
                <SectionCard>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 flex items-center gap-3">
                                <Webhook className="h-6 w-6 text-slate-400" />
                                Webhook Endpoints
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Real-time event notifications sent to external systems.
                            </p>
                        </div>
                        <button className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95 shadow-sm self-start sm:self-auto">
                            Add Endpoint
                        </button>
                    </div>

                    <div className="mt-8 space-y-4">
                        {webhooks.map((hook) => (
                            <div key={hook.name} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-sm font-black text-slate-950 truncate">{hook.name}</h3>
                                        {hook.status === 'Active' ? (
                                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">Active</span>
                                        ) : (
                                            <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-700">
                                                <AlertCircle className="h-3 w-3" /> Failing
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs font-mono font-medium text-slate-500 truncate">{hook.url}</p>
                                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">Events: {hook.events}</p>
                                </div>
                                <div className="flex items-center gap-3 self-end lg:self-center">
                                    <button className="flex h-10 px-4 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm">
                                        <RefreshCw className="h-3 w-3" /> Ping
                                    </button>
                                    <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition shadow-sm">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </ProtectedRoute>
    );
}
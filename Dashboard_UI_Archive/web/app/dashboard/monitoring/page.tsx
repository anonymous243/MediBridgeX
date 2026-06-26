import {
    Activity,
    AlertTriangle,
    Cpu,
    Database,
    ShieldCheck,
    Workflow,
} from 'lucide-react';

import { MetricCard } from '@/components/cards/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SectionCard } from '@/components/dashboard/SectionCard';

const metrics = [
    {
        title: 'Pipeline Health',
        value: '99.99%',
        icon: ShieldCheck,
        color: 'text-emerald-500',
    },
    {
        title: 'Queue Throughput',
        value: '8.2K/min',
        icon: Workflow,
        color: 'text-blue-500',
    },
    {
        title: 'CPU Usage',
        value: '42%',
        icon: Cpu,
        color: 'text-purple-500',
    },
    {
        title: 'Failed Jobs',
        value: '12',
        icon: AlertTriangle,
        color: 'text-amber-500',
    },
];

const services = [
    {
        name: 'FHIR Gateway',
        status: 'Operational',
        latency: '48ms',
    },
    {
        name: 'HL7 Transformation Engine',
        status: 'Healthy',
        latency: '72ms',
    },
    {
        name: 'Message Queue',
        status: 'Operational',
        latency: '22ms',
    },
    {
        name: 'Audit Logging Service',
        status: 'Healthy',
        latency: '61ms',
    },
];

import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';

export default function MonitoringPage() {
    return (
        <ProtectedRoute requiredPermissions={['view:observability']}>
            <div className="space-y-10">
                {/* HEADER */}
                <SectionHeader
                    title="Infrastructure Monitoring"
                    description="Monitor healthcare pipelines, interoperability services, and real-time platform observability."
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

                {/* GRID */}
                <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                    {/* ANALYTICS */}
                    <SectionCard>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                                    Pipeline Throughput
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Real-time interoperability traffic analytics.
                                </p>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                <Activity className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>

                        <div className="mt-10">
                            <BarChart
                                values={[32, 48, 64, 82, 58, 92, 74, 98]}
                            />
                        </div>
                    </SectionCard>

                    {/* SERVICES */}
                    <SectionCard>
                        <div>
                            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                                Live Services
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Infrastructure health status.
                            </p>
                        </div>

                        <div className="mt-8 space-y-5">
                            {services.map((service) => (
                                <div
                                    key={service.name}
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-black text-slate-900">
                                                {service.name}
                                            </h3>

                                            <p className="mt-2 text-sm font-semibold text-slate-500">
                                                Latency: {service.latency}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                                            {service.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>

                {/* LOGS */}
                <SectionCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                                System Logs
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Live infrastructure activity stream.
                            </p>
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                            <Database className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>

                    <div className="mt-8 overflow-auto rounded-3xl bg-slate-950 p-8">
                        <pre className="text-sm leading-8 text-slate-200">
                            {`[INFO] HL7 pipeline connected
[INFO] FHIR sync completed
[WARN] Queue latency spike detected
[INFO] Audit logs persisted
[INFO] Epic EHR transformation success`}
                        </pre>
                    </div>
                </SectionCard>
            </div>
        </ProtectedRoute>
    );
}
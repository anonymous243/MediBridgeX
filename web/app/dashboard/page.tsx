'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Database,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

import { FadeIn } from '@/components/animations/FadeIn';
import { MetricCard } from '@/components/cards/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { DashboardService, DashboardOverview } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    DashboardService.getOverview().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  const dynamicMetrics = [
    {
      title: 'Messages Today',
      value: data.metrics.messagesToday.toLocaleString(),
      icon: Activity,
      color: 'text-pink-500',
    },
    {
      title: 'FHIR Conversions',
      value: data.metrics.fhirConversions.toLocaleString(),
      icon: Workflow,
      color: 'text-blue-500',
    },
    {
      title: 'Connected Systems',
      value: data.metrics.connectedSystems.toLocaleString(),
      icon: Database,
      color: 'text-purple-500',
    },
    {
      title: 'Compliance Status',
      value: `${data.metrics.complianceStatus}%`,
      icon: ShieldCheck,
      color: 'text-emerald-500',
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-10">
      {/* HEADER */}
      <FadeIn>
        <SectionHeader
          title="Interoperability Overview"
          description="Monitor healthcare infrastructure, interoperability pipelines, and real-time clinical traffic."
        />
      </FadeIn>

      {/* METRICS */}
      <FadeIn delay={0.1}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dynamicMetrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
            />
          ))}
        </div>
      </FadeIn>

      {/* GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] 2xl:grid-cols-[1.4fr_0.6fr]">
        {/* TRAFFIC */}
        <FadeIn delay={0.2}>
          <SectionCard className="h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                  Traffic Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Real-time interoperability throughput.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">
                <ArrowUpRight className="h-4 w-4" />
                +18.2%
              </div>
            </div>

            <div className="mt-10 overflow-hidden">
              <BarChart
                values={data.trafficAnalytics}
              />
            </div>
          </SectionCard>
        </FadeIn>

        {/* ACTIVITY */}
        <FadeIn delay={0.3}>
          <SectionCard className="h-full">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                Live Systems
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Infrastructure monitoring status.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {data.liveSystems.map((item) => (
                <div
                  key={item.title}
                  className="
                    group flex items-center justify-between
                    rounded-2xl border border-slate-100
                    bg-slate-50 px-5 py-4
                    transition-all duration-300
                    hover:border-slate-200
                    hover:bg-white
                    hover:shadow-md
                  "
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <h3 className="font-bold text-slate-900 truncate">
                      {item.title}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.time}
                    </p>
                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-full bg-emerald-100
                      px-3 py-1.5 text-xs font-bold
                      text-emerald-700
                    "
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
}
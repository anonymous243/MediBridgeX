'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { UsageMetric } from '@/types/developers';

interface UsageChartProps {
  data: UsageMetric[];
  title: string;
  metric: 'requests' | 'errors' | 'latency';
  color?: string;
}

const COLORS = {
  requests: '#3b82f6',
  errors: '#ef4444',
  latency: '#10b981',
};

export function UsageChart({ data, title, metric, color }: UsageChartProps) {
  const primaryColor = color || COLORS[metric];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
            {title}
          </h3>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {data && data.length > 0 ? data[data.length - 1][metric].toLocaleString() : '0'}
            {metric === 'latency' ? 'ms' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
            +12.5%
          </span>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.1} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="timestamp"
              hide
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {payload[0].value}
                        {metric === 'latency' ? 'ms' : ''}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={primaryColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color${metric})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

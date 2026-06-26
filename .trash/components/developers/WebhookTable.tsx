'use client';

import React from 'react';
import { 
  Webhook, 
  ExternalLink, 
  MoreHorizontal, 
  RefreshCcw, 
  FileText, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { WebhookEndpoint } from '@/types/developers';
import { DataTable } from '../tables/DataTable';

interface WebhookTableProps {
  endpoints: WebhookEndpoint[];
}

export function WebhookTable({ endpoints }: WebhookTableProps) {
  const columns = [
    {
      header: 'Endpoint',
      key: 'url',
      render: (value: string, row: WebhookEndpoint) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Webhook className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{value}</p>
            <p className="mt-0.5 text-xs text-slate-500 truncate">{row.description}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {value === 'active' ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
              <ShieldCheck className="h-3 w-3" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600">
              <AlertCircle className="h-3 w-3" /> Failed
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Events',
      key: 'events',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((event) => (
            <span key={event} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              {event}
            </span>
          ))}
          {value.length > 2 && (
            <span className="text-[10px] font-bold text-slate-400">
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Created',
      key: 'createdAt',
      render: (value: string) => (
        <span className="text-sm font-medium text-slate-500">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <FileText className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns}
        data={endpoints}
        emptyState={{
          icon: Webhook,
          title: "No webhooks configured",
          description: "Connect your clinical systems to external services via real-time webhooks."
        }}
      />
      <div className="flex items-center justify-between px-6 py-2">
         <p className="text-xs font-semibold text-slate-500">Showing {endpoints.length} endpoints</p>
         <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
            View Delivery Logs <ExternalLink className="h-3 w-3" />
         </button>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    ChevronRight, 
    Database, 
    RefreshCcw,
    Play,
    Search,
    LucideIcon,
    Zap
} from 'lucide-react';
import { DataTable } from '../tables/DataTable';
import { format } from 'date-fns';
import { Message, MessageStatus } from '../../types/message';
import { useMessageStore } from '@/stores/useMessageStore';

interface MessageStreamProps {
    onMessageClick: (message: Message) => void;
}

const statusConfig: Record<MessageStatus, { color: string, icon: LucideIcon, bg: string, label: string }> = {
    Delivered: { color: 'text-emerald-500', icon: CheckCircle2, bg: 'bg-emerald-500/10', label: 'Delivered' },
    Failed: { color: 'text-rose-500', icon: AlertCircle, bg: 'bg-rose-500/10', label: 'Failed' },
    Processing: { color: 'text-blue-500', icon: Play, bg: 'bg-blue-500/10', label: 'Processing' },
    Queued: { color: 'text-slate-400', icon: Clock, bg: 'bg-slate-500/10', label: 'Queued' },
    Retrying: { color: 'text-amber-500', icon: RefreshCcw, bg: 'bg-amber-500/10', label: 'Retrying' },
    Validated: { color: 'text-purple-500', icon: CheckCircle2, bg: 'bg-purple-500/10', label: 'Validated' }
};

export function MessageStream({ onMessageClick }: MessageStreamProps) {
    const { messages, isLoading, filterQuery, statusFilter } = useMessageStore();

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => {
            const matchesQuery = !filterQuery || 
                msg.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
                msg.correlationId.toLowerCase().includes(filterQuery.toLowerCase()) ||
                msg.patientName?.toLowerCase().includes(filterQuery.toLowerCase());
            
            const matchesStatus = !statusFilter || msg.status === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [messages, filterQuery, statusFilter]);

    const columns = [
        {
            header: 'Message Identification',
            key: 'id',
            render: (value: any, row: Message) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black tracking-tight text-slate-950">{row.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{row.correlationId}</span>
                </div>
            )
        },
        {
            header: 'Source System',
            key: 'sourceSystem',
            className: 'hidden lg:flex',
            render: (value: any) => (
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                        <Database className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 truncate">{value}</span>
                </div>
            )
        },
        {
            header: 'Message Type',
            key: 'messageType',
            render: (value: any, row: Message) => (
                <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-black text-white uppercase tracking-widest">
                        {value}
                    </span>
                    {row.patientName && (
                        <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">
                            {row.patientName}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            key: 'status',
            render: (value: MessageStatus) => {
                const config = statusConfig[value];
                return (
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${config.bg} border border-transparent transition-colors`}>
                        <config.icon className={`h-3.5 w-3.5 ${config.color} ${value === 'Processing' ? 'animate-spin' : ''}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                            {config.label}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Timestamp',
            key: 'timestamp',
            render: (value: string) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-600">{format(new Date(value), 'HH:mm:ss.SSS')}</span>
                    <span className="text-[10px] font-bold text-slate-400">{format(new Date(value), 'MMM dd, yyyy')}</span>
                </div>
            )
        }
    ];

    return (
        <div className="w-full space-y-4">
            <DataTable 
                columns={columns}
                data={filteredMessages}
                isLoading={isLoading}
                onRowClick={onMessageClick}
                emptyState={{
                    icon: Search,
                    title: "No messages matched your filter",
                    description: "Adjust your search query or status filters to find the clinical transactions you are looking for."
                }}
            />

            {/* Pagination / Load More */}
            <div className="flex items-center justify-center pt-8 pb-4">
                <button className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95">
                    <RefreshCcw className="h-4 w-4 text-slate-400 group-hover:rotate-180 transition-transform duration-700" />
                    Load More Activity
                </button>
            </div>
        </div>
    );
}



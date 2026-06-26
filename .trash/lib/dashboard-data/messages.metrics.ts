import {
    Activity,
    AlertTriangle,
    Clock3,
    ShieldCheck,
} from 'lucide-react';

export const messageMetrics = [
    {
        title: 'Messages Processed',
        value: '24,892',
        icon: Activity,
        color: 'text-pink-500',
    },
    {
        title: 'FHIR Transformations',
        value: '18,201',
        icon: ShieldCheck,
        color: 'text-blue-500',
    },
    {
        title: 'Failed Messages',
        value: '42',
        icon: AlertTriangle,
        color: 'text-amber-500',
    },
    {
        title: 'Queue Latency',
        value: '48ms',
        icon: Clock3,
        color: 'text-emerald-500',
    },
];
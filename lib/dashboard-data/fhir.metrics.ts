import {
    Activity,
    Database,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

export const fhirMetrics = [
    {
        title: 'FHIR Resources',
        value: '184K',
        icon: Database,
        color: 'text-pink-500',
    },
    {
        title: 'Validated Records',
        value: '97.8%',
        icon: ShieldCheck,
        color: 'text-blue-500',
    },
    {
        title: 'Patient Resources',
        value: '48K',
        icon: UserRound,
        color: 'text-purple-500',
    },
    {
        title: 'Live API Sync',
        value: 'Active',
        icon: Activity,
        color: 'text-emerald-500',
    },
];
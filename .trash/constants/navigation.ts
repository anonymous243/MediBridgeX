import {
    Activity,
    Database,
    LayoutDashboard,
    Network,
    Settings,
    ShieldCheck,
    Code2,
} from 'lucide-react';

import { ROUTES } from './routes';
import { Permission, UserRole } from '@/types/auth';

export interface NavigationItem {
    name: string;
    href: string;
    icon: any;
    requiredPermissions?: Permission[];
    requiredRoles?: UserRole[];
}

export const dashboardNavigation: NavigationItem[] = [
    {
        name: 'Overview',
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        name: 'Messages',
        href: ROUTES.MESSAGES,
        icon: Activity,
        requiredPermissions: ['view:messages']
    },
    {
        name: 'FHIR Explorer',
        href: ROUTES.FHIR,
        icon: Database,
        requiredPermissions: ['view:fhir']
    },
    {
        name: 'Integrations',
        href: ROUTES.INTEGRATIONS,
        icon: Network,
        requiredPermissions: ['manage:settings'] // Example requirement
    },
    {
        name: 'Monitoring',
        href: ROUTES.MONITORING,
        icon: ShieldCheck,
        requiredPermissions: ['view:observability']
    },
    {
        name: 'Settings',
        href: ROUTES.SETTINGS,
        icon: Settings,
        requiredPermissions: ['manage:settings']
    },
    {
        name: 'Developers',
        href: ROUTES.DEVELOPERS,
        icon: Code2,
        requiredPermissions: ['access:developer_tools']
    },
];
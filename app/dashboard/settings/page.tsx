'use client';

import React, { useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Terminal, 
  Users, 
  Bell, 
  ChevronRight,
  Settings,
  Activity,
  History,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import sections
import { OrganizationSection } from '@/components/settings/sections/OrganizationSection';
import { SecuritySection } from '@/components/settings/sections/SecuritySection';
import { DeveloperSection } from '@/components/settings/sections/DeveloperSection';
import { MembersSection } from '@/components/settings/sections/MembersSection';
import { NotificationsSection } from '@/components/settings/sections/NotificationsSection';
import { AuditLogsSection } from '@/components/settings/sections/AuditLogsSection';
import { useSettingsStore } from '@/stores/useSettingsStore';

import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';
import { PermissionGuard } from '@/components/dashboard/PermissionGuard';
import { useAuthStore } from '@/stores/useAuthStore';
import { hasPermission } from '@/lib/rbac';
import { Permission } from '@/types/auth';

interface TabDefinition {
  id: string;
  label: string;
  icon: any;
  component: React.ComponentType;
  requiredPermissions?: Permission[];
}

const tabs: TabDefinition[] = [
  { id: 'org', label: 'Organization', icon: Building2, component: OrganizationSection },
  { id: 'security', label: 'Security', icon: ShieldCheck, component: SecuritySection, requiredPermissions: ['manage:settings'] },
  { id: 'developers', label: 'Developers', icon: Terminal, component: DeveloperSection, requiredPermissions: ['access:developer_tools'] },
  { id: 'members', label: 'Members', icon: Users, component: MembersSection, requiredPermissions: ['manage:users'] },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationsSection, requiredPermissions: ['manage:settings'] },
  { id: 'audit-logs', label: 'Audit Logs', icon: History, component: AuditLogsSection, requiredPermissions: ['view:audit_logs'] },
];

export default function SettingsPage() {
  const { activeTab, setActiveTab, isLoading, fetchSettings } = useSettingsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Filter tabs based on user permissions
  const availableTabs = tabs.filter(tab => 
    !tab.requiredPermissions || tab.requiredPermissions.every(p => hasPermission(user, p))
  );

  // If current active tab is not allowed, fallback to first available
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [activeTab, availableTabs, setActiveTab]);

  const activeTabDef = availableTabs.find(t => t.id === activeTab) || availableTabs[0];
  const ActiveComponent = activeTabDef?.component || OrganizationSection;

  return (
    <ProtectedRoute requiredPermissions={['manage:settings']}>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-32 space-y-2">
            <div className="mb-8 px-4">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 flex items-center gap-3">
                Settings
                {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Manage your workspace and clinical infrastructure.
              </p>
            </div>

            <nav className="space-y-1">
              {availableTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200",
                      isActive 
                        ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                        : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                        isActive ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {tab.label}
                    </div>
                    {isActive && (
                      <motion.div layoutId="active-indicator">
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4 backdrop-blur-sm border border-white/10">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <h4 className="font-bold text-sm">Enterprise Plan</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Unlimited FHIR syncs, advanced audit logs, and dedicated support.
                </p>
                <button className="mt-4 w-full rounded-xl bg-white/10 py-2 text-xs font-bold hover:bg-white/20 transition-all border border-white/10">
                  View Billing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <PermissionGuard requiredPermissions={activeTabDef?.requiredPermissions}>
                <ActiveComponent />
              </PermissionGuard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}
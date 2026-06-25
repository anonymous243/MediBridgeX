import { Metadata } from 'next';
import React, { Suspense } from 'react';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { EmptyState } from '@/components/states/EmptyState';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Audit Trail | MediBridgeX',
  description: 'Cryptographically signed HIPAA audit logs',
};

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Audit Trail</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Immutable, cryptographically signed record of all data access and modifications to satisfy HIPAA, SOC2, and HITRUST requirements.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium border border-green-200 dark:border-green-800/30">
          <ShieldCheckIcon className="w-4 h-4" />
          Tamper-Proof Signatures Active
        </div>
      </div>

      <SectionCard>
        <Suspense fallback={
          <div className="animate-pulse space-y-4 p-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        }>
          <AuditLogTable />
        </Suspense>
      </SectionCard>
    </div>
  );
}

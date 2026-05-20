'use client';

import React, { useState } from 'react';
import { History, Download, Search, Filter, ShieldCheck, Key, Users, Settings as SettingsIcon, Terminal } from 'lucide-react';
import { SettingsCard } from '../SettingsCard';
import { SettingsSection } from '../SettingsSection';
import { PermissionGuard } from '@/components/dashboard/PermissionGuard';

const MOCK_AUDIT_LOGS = [
  { id: 'log_001', actor: 'Alice Chen (Admin)', action: 'Revoked API Key', target: 'Prod-Key-1', date: 'Just now', icon: Key, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'log_002', actor: 'System', action: 'Automated Backup Completed', target: 'FHIR Datastore', date: '2 mins ago', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'log_003', actor: 'Alice Chen (Admin)', action: 'Invited Member', target: 'dr.smith@example.com', date: '1 hour ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'log_004', actor: 'Bob Miller (Developer)', action: 'Added Webhook', target: 'https://api.hospital.org/hl7', date: '3 hours ago', icon: Terminal, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'log_005', actor: 'System', action: 'Failed Login Attempt', target: 'Unknown IP (192.168.1.1)', date: '5 hours ago', icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'log_006', actor: 'Alice Chen (Admin)', action: 'Updated Compliance Controls', target: 'MFA Required', date: '1 day ago', icon: SettingsIcon, color: 'text-slate-500', bg: 'bg-slate-100' },
];

export function AuditLogsSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => 
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SettingsSection 
      title="Audit Logs" 
      description="Comprehensive timeline of all administrative actions and security events within your organization."
    >
      <SettingsCard 
        title="Event Timeline" 
        description="Monitor system changes in real-time."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search logs by actor, action, or target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
              <PermissionGuard requiredRoles={['admin', 'super_admin']}>
                <button className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </PermissionGuard>
            </div>
          </div>

          <div className="space-y-4">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${log.bg} ${log.color}`}>
                      <log.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{log.action}</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        <span className="text-slate-700">{log.actor}</span> on <span className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-600">{log.target}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {log.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-sm font-medium text-slate-500">No logs match your search.</p>
              </div>
            )}
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}

'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Fingerprint, History, Monitor, Zap, Trash2, Smartphone, Laptop } from 'lucide-react';
import { SettingsCard } from '../SettingsCard';
import { SettingsSection } from '../SettingsSection';
import { SecurityStatus } from '../SecurityStatus';
import { NotificationToggle } from '../NotificationToggle';
import { Modal } from '../../modals/Modal';
import { toast } from 'sonner';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function SecuritySection() {
  const { compliance, isLoading } = useSettingsStore();
  const [sessions, setSessions] = useState([
    { id: 1, device: "MacBook Pro 16\"", location: "N. Virginia, USA", ip: "192.168.1.1", status: "Active Now", icon: Laptop },
    { id: 2, device: "iPhone 15 Pro", location: "New York, USA", ip: "172.16.0.42", status: "2 hours ago", icon: Smartphone },
  ]);
  const [sessionToRevoke, setSessionToRevoke] = useState<number | null>(null);

  const handleRevoke = () => {
    if (sessionToRevoke) {
      setSessions(sessions.filter(s => s.id !== sessionToRevoke));
      setSessionToRevoke(null);
      toast.success('Session revoked successfully');
    }
  };

  if (!compliance && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <SettingsSection 
      title="Security & Compliance" 
      description="Configure enterprise-grade security protocols and monitor HIPAA/SOC2 compliance status."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SecurityStatus label="HIPAA Compliant" status={compliance?.hipaaControls ? "compliant" : "warning"} />
        <SecurityStatus label="SOC2 Type II" status={compliance?.auditLogging ? "active" : "warning"} />
        <SecurityStatus label="AES-256 Encrypted" status={compliance?.encryption ? "active" : "warning"} />
        <SecurityStatus label="MFA Required" status={compliance?.mfa ? "compliant" : "warning"} />
      </div>

      <SettingsCard title="Access Control" description="Advanced authentication and session management settings.">
        <div className="space-y-4">
          <NotificationToggle 
            title="Multi-Factor Authentication (MFA)" 
            description="Require all organization members to authenticate with a secondary device or biometric key."
            icon={Fingerprint}
            enabled={!!compliance?.mfa}
            onChange={() => {}} // TODO: Add updateCompliance to store
          />
          <NotificationToggle 
            title="Session Timeout" 
            description="Automatically sign out inactive users after 15 minutes of inactivity to maintain clinical security."
            icon={Lock}
            enabled={!!compliance?.sessionTimeout}
            onChange={() => {}} // TODO: Add updateCompliance to store
          />
          <NotificationToggle 
            title="Single Sign-On (SSO)" 
            description="Connect your enterprise identity provider (Okta, Azure AD) for seamless access management."
            icon={Zap}
            enabled={false} // SSO not in mock compliance
            onChange={() => {}}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Device Management" description="Monitor and manage active devices accessing your infrastructure.">
        <div className="space-y-4">
          {sessions.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.device}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.location} • {item.ip}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.status}</span>
                <button 
                  onClick={() => setSessionToRevoke(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <Modal
        open={sessionToRevoke !== null}
        onOpenChange={(open) => !open && setSessionToRevoke(null)}
        title="Revoke Session?"
        description="This will immediately sign out the user from this device. They will need to re-authenticate to gain access."
      >
        <div className="flex gap-4">
          <button 
            onClick={() => setSessionToRevoke(null)}
            className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Keep Session
          </button>
          <button 
            onClick={handleRevoke}
            className="flex-1 rounded-2xl bg-red-600 py-4 text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-600/10 transition-all"
          >
            Revoke Access
          </button>
        </div>
      </Modal>
    </SettingsSection>
  );
}

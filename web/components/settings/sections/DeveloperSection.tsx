'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Plus, Webhook, Shield, Activity, Search, Calendar, ShieldCheck } from 'lucide-react';
import { SettingsCard } from '../SettingsCard';
import { SettingsSection } from '../SettingsSection';
import { ApiKeyCard } from '../ApiKeyCard';
import { Modal } from '../../modals/Modal';
import { toast } from 'sonner';
import { useDeveloperStore } from '@/stores/useDeveloperStore';

export function DeveloperSection() {
  const { apiKeys, webhooks, isLoading, fetchApiKeys, createKey, revokeKey, createWebhook, deleteWebhook, initialize } = useDeveloperStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<'live' | 'test'>('test');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleCreateKey = async () => {
    if (!newKeyName) {
      toast.error('Please enter a key name');
      return;
    }
    
    await createKey(newKeyName, selectedEnv, ['patient.read']);
    setNewKeyName('');
    setIsModalOpen(false);
    toast.success('API Key generated successfully');
  };

  const handleRevokeKey = async (id: string) => {
    await revokeKey(id);
    toast.success('API Key revoked');
  };

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl) {
      toast.error('Please enter a valid URL');
      return;
    }
    await createWebhook(newWebhookUrl, ['fhir.created']);
    setNewWebhookUrl('');
    setIsWebhookModalOpen(false);
    toast.success('Webhook endpoint registered successfully');
  };

  const handleDeleteWebhook = async (id: string) => {
    await deleteWebhook(id);
    toast.success('Webhook deleted');
  };

  return (
    <SettingsSection 
      title="Developer Tools" 
      description="Manage API credentials, configure webhooks, and monitor infrastructure connectivity."
    >
      <SettingsCard 
        title="API Keys" 
        description="Keys are used to authenticate requests to the MediBridgeX API. Keep them secure."
      >
        <div className="space-y-4">
          {apiKeys.map(k => (
            <ApiKeyCard 
              key={k.id}
              name={k.name} 
              apiKey={k.key}
              lastUsed={k.lastUsedAt || 'Never'}
              createdAt={new Date(k.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              onRevoke={() => handleRevokeKey(k.id)}
            />
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-4 text-sm font-bold text-slate-500 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
            Generate new API Key
          </button>
        </div>
      </SettingsCard>

      <SettingsCard 
        title="Webhooks" 
        description="Receive real-time notifications for interoperability events and infrastructure alerts."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter endpoints..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsWebhookModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Endpoint
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Endpoint URL</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Events</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {webhooks.map((hook) => (
                  <tr key={hook.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{hook.url}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {hook.events.map(ev => (
                          <code key={ev} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{ev}</code>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider ${hook.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${hook.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        {hook.status === 'active' ? 'Healthy' : hook.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteWebhook(hook.id)}
                        className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SettingsCard>

      <Modal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        title="Create API Key"
        description="Generate a new key for authenticating with the MediBridgeX platform."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Key Name</label>
            <input 
              type="text" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Production FHIR Feed"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Environment</label>
              <select 
                value={selectedEnv}
                onChange={(e) => setSelectedEnv(e.target.value as 'live' | 'test')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Expiration</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 pl-11 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all">
                  <option>30 Days</option>
                  <option>90 Days</option>
                  <option>1 Year</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 flex items-center gap-2">
              <ShieldCheck className="h-3 w-3" /> Scopes
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Read-only', 'FHIR Write', 'HL7 Process', 'Infra Admin'].map((perm, i) => (
                <label key={i} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white cursor-pointer transition-all">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs font-bold text-slate-700">{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateKey}
              className="flex-1 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
            >
              Generate Key
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        open={isWebhookModalOpen} 
        onOpenChange={setIsWebhookModalOpen}
        title="Add Webhook Endpoint"
        description="Register a URL to receive real-time FHIR payloads via POST requests."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Endpoint URL</label>
            <input 
              type="url" 
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              placeholder="https://your-hospital.com/api/fhir-sync"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setIsWebhookModalOpen(false)}
              className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateWebhook}
              className="flex-1 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
            >
              Add Webhook
            </button>
          </div>
        </div>
      </Modal>
    </SettingsSection>
  );
}

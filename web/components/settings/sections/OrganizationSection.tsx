'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Hash, Link as LinkIcon } from 'lucide-react';
import { SettingsCard } from '../SettingsCard';
import { SettingsSection } from '../SettingsSection';
import { RegionCombobox } from '../RegionCombobox';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { toast } from 'sonner';

export function OrganizationSection() {
  const { organization, isLoading, updateOrganization } = useSettingsStore();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    region: ''
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        slug: organization.slug,
        region: organization.region
      });
    }
  }, [organization]);

  const handleSave = async () => {
    try {
      await updateOrganization(formData);
      toast.success('Organization settings updated');
    } catch (error) {
      toast.error('Failed to update organization');
    }
  };

  if (!organization && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <SettingsSection 
      title="Organization Profile" 
      description="Manage your healthcare network identity and regional infrastructure settings."
    >
      <SettingsCard title="General Information" description="How your organization appears across the platform.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Organization Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Network ID</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value="MB-7729-HL7"
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Workspace Slug</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Region</label>
            <RegionCombobox 
              value={formData.region} 
              onChange={(region) => setFormData({ ...formData, region })} 
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Organization Branding" description="Upload your logo and customize the look of your interoperability reports.">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition-all group-hover:border-blue-400 group-hover:bg-blue-50">
              <Building2 className="h-8 w-8" />
            </div>
            <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 text-slate-600 hover:text-blue-600 transition-all">
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Organization Logo</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              We recommend an SVG or high-resolution transparent PNG. Minimum 512x512px.
            </p>
            <div className="flex gap-3 mt-3">
              <button className="text-xs font-bold text-blue-600 hover:underline">Upload new</button>
              <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
            </div>
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}

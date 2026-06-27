'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Users, Mail, Shield, UserPlus, MoreHorizontal, Trash2, ShieldCheck, MailQuestion, Edit2, Send } from 'lucide-react';
import { SettingsCard } from '../SettingsCard';
import { SettingsSection } from '../SettingsSection';
import { RoleBadge } from '../RoleBadge';
import { Modal } from '../../modals/Modal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

type Role = 'Administrator' | 'Developer' | 'Operator' | 'Auditor';

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Pending';
  avatar?: string;
}

const roles: { id: Role; description: string }[] = [
  { id: 'Administrator', description: 'Full access to all settings and organization management.' },
  { id: 'Developer', description: 'Access to API keys, webhooks, and infrastructure monitoring.' },
  { id: 'Operator', description: 'Can manage clinical feeds and message processing.' },
  { id: 'Auditor', description: 'Read-only access to all logs and compliance reports.' },
];

export function MembersSection() {
  const { team, isLoading } = useSettingsStore();
  const { user } = useAuthStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('Developer');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map store team to local member format
  const members: Member[] = team.map((m, idx) => ({
    id: idx.toString(),
    name: m.email.split('@')[0],
    email: m.email,
    role: (m.role.charAt(0).toUpperCase() + m.role.slice(1)) as Role,
    status: idx === 2 ? 'Pending' : 'Active' // Mock one pending user for demo purposes
  }));

  const handleInvite = () => {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(inviteEmail);

    if (!result.success) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // In a real app, this would call a store action
    setIsInviteOpen(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRoleUpdate = () => {
    if (editingMember) {
      toast.success(`Role updated to ${selectedRole} for ${editingMember.name}`);
      setEditingMember(null);
    }
  };

  const handleResend = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
    setOpenDropdownId(null);
  };

  const handleRemove = (id: string) => {
    // In a real app, this would call a store action
    toast.success('Member removed');
  };

  if (members.length === 0 && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <SettingsSection 
      title="User & Role Management" 
      description="Manage organization access and define granular RBAC permissions for clinical staff."
    >
      <SettingsCard 
        title="Team Members" 
        description="Invite users and assign roles to manage your healthcare infrastructure."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {members.length} Members
            </h3>
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 active:scale-95 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Member</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {members.map((member) => (
                  <tr key={member.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-slate-100 text-slate-500 font-bold border border-slate-200 shadow-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{member.name}</span>
                          <span className="text-xs text-slate-500 font-medium">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                        member.status === 'Active' ? "text-emerald-600" : "text-amber-600"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", member.status === 'Active' ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        <div className="relative" ref={openDropdownId === member.id ? dropdownRef : null}>
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                            className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          
                          <AnimatePresence>
                            {openDropdownId === member.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-10"
                              >
                                <button
                                  onClick={() => {
                                    setSelectedRole(member.role);
                                    setEditingMember(member);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <Edit2 className="h-4 w-4" /> Edit Role
                                </button>
                                {member.status === 'Pending' && (
                                  <button
                                    onClick={() => handleResend(member.email)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                  >
                                    <Send className="h-4 w-4" /> Resend Invite
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {member.email !== user?.email && (
                          <button 
                            onClick={() => handleRemove(member.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard 
        title="RBAC Overview" 
        description="Quick preview of role permissions across the MediBridgeX platform."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <div key={role.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-400" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">{role.id}</h4>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </SettingsCard>

      <Modal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        title="Invite New Member"
        description="Grant access to your healthcare organization by sending an email invitation."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="clinician@hospital.org"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 pl-11 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Assign Role</label>
            <div className="grid gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border transition-all text-left",
                    selectedRole === role.id 
                      ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10" 
                      : "border-slate-100 bg-slate-50/50 hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={cn("h-4 w-4", selectedRole === role.id ? "text-blue-600" : "text-slate-400")} />
                    <span className={cn("text-sm font-bold", selectedRole === role.id ? "text-blue-900" : "text-slate-700")}>
                      {role.id}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-slate-500 leading-tight">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => setIsInviteOpen(false)}
              className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleInvite}
              className="flex-1 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
            >
              Send Invite
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        title="Edit Member Role"
        description={`Update the access level for ${editingMember?.name}.`}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Assign Role</label>
            <div className="grid gap-2 max-h-[280px] overflow-y-auto pr-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border transition-all text-left",
                    selectedRole === role.id 
                      ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10" 
                      : "border-slate-100 bg-slate-50/50 hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={cn("h-4 w-4", selectedRole === role.id ? "text-blue-600" : "text-slate-400")} />
                    <span className={cn("text-sm font-bold", selectedRole === role.id ? "text-blue-900" : "text-slate-700")}>
                      {role.id}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-slate-500 leading-tight">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => setEditingMember(null)}
              className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleRoleUpdate}
              className="flex-1 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
            >
              Update Role
            </button>
          </div>
        </div>
      </Modal>
    </SettingsSection>
  );
}

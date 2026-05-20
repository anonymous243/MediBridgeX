import React, { useState } from 'react';
import { Mail, Plus, X, UserPlus, Shield, Terminal, Settings, Eye, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TeamMember, TeamRole } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TeamInviteProps {
  members: TeamMember[];
  onAdd: (member: TeamMember) => void;
  onRemove: (email: string) => void;
}

const ROLE_CONFIG: Record<TeamRole, { label: string; icon: LucideIcon; color: string; desc: string }> = {
  admin: { label: 'Administrator', icon: Shield, color: 'text-red-600 bg-red-50', desc: 'Full access to all systems and billing.' },
  operator: { label: 'Operator', icon: Settings, color: 'text-amber-600 bg-amber-50', desc: 'Infrastructure management and monitoring.' },
  developer: { label: 'Developer', icon: Terminal, color: 'text-blue-600 bg-blue-50', desc: 'API access and application deployment.' },
  auditor: { label: 'Auditor', icon: Eye, color: 'text-purple-600 bg-purple-50', desc: 'Read-only access to audit logs and security.' },
};

export function TeamInvite({ members, onAdd, onRemove }: TeamInviteProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamRole>('developer');

  const handleAdd = () => {
    if (email && !members.find(m => m.email === email)) {
      onAdd({ email, role });
      setEmail('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-[2.5rem] border-2 border-slate-100 bg-white p-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
           <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserPlus className="h-6 w-6" />
           </div>
           <div>
              <h3 className="text-lg font-bold text-slate-900">Add Team Members</h3>
              <p className="text-xs font-medium text-slate-500">Collaborate with infrastructure experts across your org.</p>
           </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@organization.com"
                className="pl-12"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign Workspace Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.entries(ROLE_CONFIG) as [TeamRole, typeof ROLE_CONFIG['admin']][]).map(([r, config]) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all",
                    role === r ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.color)}>
                      <config.icon className="h-4 w-4" />
                    </div>
                    {role === r && (
                      <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight text-slate-900">{config.label}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">{config.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!email}
            size="lg"
            variant="primary"
            className="w-full uppercase tracking-widest text-xs"
          >
            <Plus className="mr-2 h-4 w-4" /> Add to Workspace
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pending Invitations ({members.length})</h4>
        <AnimatePresence initial={false}>
          <div className="space-y-2">
            {members.map((member) => (
              <motion.div
                key={member.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between rounded-2xl border-2 border-slate-100 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", ROLE_CONFIG[member.role].color)}>
                    <RoleIcon role={member.role} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{member.email}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {ROLE_CONFIG[member.role].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(member.email)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
            {members.length === 0 && (
                <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400">
                    <UserPlus className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs font-bold">No invitations added yet</p>
                </div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function RoleIcon({ role }: { role: TeamRole }) {
  const Icon = ROLE_CONFIG[role].icon;
  return <Icon className="h-5 w-5" />;
}

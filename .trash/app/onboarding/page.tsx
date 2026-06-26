'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Clock,
  ChevronLeft,
  ArrowRight,
  Shield,
  Loader2,
  Users,
  Cpu,
} from 'lucide-react';
import { LoadingState } from '@/components/states/LoadingState';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

import { Stepper } from '@/components/onboarding/Stepper';
import { InfrastructureSelector } from '@/components/onboarding/InfrastructureSelector';
import { InfraPreferencesStep } from '@/components/onboarding/InfraPreferencesStep';
import { ComplianceSetup } from '@/components/onboarding/ComplianceSetup';
import { TeamInvite } from '@/components/onboarding/TeamInvite';
import { ProvisioningScreen } from '@/components/onboarding/ProvisioningScreen';
import { RegionSelector } from '@/components/onboarding/RegionSelector';
import { OnboardingStep, OrganizationType, HospitalSize, FhirVersion } from '@/types/onboarding';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAuthStore } from '@/stores/useAuthStore';

const ORG_TYPES: OrganizationType[] = [
  'Hospital Network',
  'Clinic',
  'Diagnostic Center',
  'Insurance Provider',
  'Telehealth Platform',
  'Healthcare SaaS',
  'Research Institution',
];

const HOSPITAL_SIZES: HospitalSize[] = [
  'Small (<100 beds)',
  'Medium (100–500 beds)',
  'Large (500–2000 beds)',
  'Enterprise (2000+ beds)',
];

const STEP_META = [
  { num: 1, title: 'Organization Setup', subtitle: 'Configure your clinical workspace and data residency.', icon: Building2 },
  { num: 2, title: 'Infrastructure Selection', subtitle: 'Choose the modules for your interoperability needs.', icon: Cpu },
  { num: 3, title: 'Infrastructure Preferences', subtitle: 'Configure FHIR version, HL7 support, and cloud region.', icon: Shield },
  { num: 4, title: 'Security & Compliance', subtitle: 'Enable security controls and compliance monitoring.', icon: Shield },
  { num: 5, title: 'Team Management', subtitle: 'Invite administrators and clinical operators.', icon: Users },
];

export default function OnboardingPage() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const setSessionUser = useAuthStore((s) => s.setSessionUser);

  const {
    accountDetails,
    step,
    organization,
    infrastructure,
    infraPreferences,
    compliance,
    team,
    isLoading,
    setStep,
    updateOrg,
    toggleInfra,
    updateInfraPref,
    updateCompliance,
    addTeamMember,
    removeTeamMember,
    initialize,
    submitOnboarding,
  } = useWorkspaceStore();

  // Guard: if authenticated with completed onboarding, skip to dashboard
  useEffect(() => {
    if (authUser?.onboardingCompleted) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [authUser, router]);

  // Guard: if no account details captured (user didn't go through sign-up), redirect to sign-up
  useEffect(() => {
    if (!accountDetails && !authUser) {
      router.replace('/auth/sign-up');
    }
  }, [accountDetails, authUser, router]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const nextStep = async () => {
    if (step === 5) {
      const success = await submitOnboarding();
      if (success) {
        // Provision the session: first user becomes org admin
        const orgSlug = organization.slug || organization.name.toLowerCase().replace(/\s+/g, '-');
        const orgId = `org_${orgSlug}`;
        setSessionUser({
          id: `u_${Date.now()}`,
          email: accountDetails?.workEmail || authUser?.email || 'admin@workspace.com',
          name: accountDetails?.fullName || authUser?.name || 'Org Admin',
          role: 'admin', // First user = org admin, never super_admin
          organizationId: orgId,
          organizationName: organization.name,
          permissions: [
            'manage:users',
            'view:analytics',
            'manage:settings',
            'view:observability',
            'view:messages',
            'view:fhir',
            'manage:api_keys',
            'manage:webhooks',
            'view:audit_logs',
            'access:developer_tools',
          ],
          onboardingCompleted: true,
          workspaceSlug: orgSlug,
          workspace: {
            slug: orgSlug,
            region: organization.region,
            organizationType: organization.type,
            hospitalSize: organization.hospitalSize,
            fhirVersion: infraPreferences.fhirVersion,
            provisionedAt: new Date().toISOString(),
          },
        });
        setStep(6 as OnboardingStep); // Step 6 = provisioning screen
      }
    } else {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const prevStep = () => setStep(Math.max(step - 1, 1) as OnboardingStep);

  if (isLoading && step === 1 && !organization.name) {
    return <LoadingState size="fullscreen" message="Initializing Environment..." />;
  }

  if (step === 6) {
    return (
      <ProvisioningScreen
        organizationName={organization.name}
        organizationSlug={organization.slug || organization.name.toLowerCase().replace(/\s+/g, '-')}
        region={organization.region}
        onComplete={() => router.push(ROUTES.DASHBOARD)}
      />
    );
  }

  const currentMeta = STEP_META[step - 1];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* HEADER */}
      <header className="fixed top-0 left-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        {/* Signature top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500" />

        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <Link href="/" className="shrink-0">
            <Logo size={28} showText={true} layout="horizontal" />
          </Link>

          {/* Stepper */}
          <div className="flex-1 max-w-[180px] sm:max-w-sm lg:max-w-md mx-4">
            <Stepper currentStep={step} totalSteps={5} />
          </div>

          {/* Right status */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Trust Center Active</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              {['HIPAA', 'FHIR'].map((b) => (
                <span key={b} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-36 sm:pt-44 pb-40">
        <AnimatePresence mode="wait">

          {/* STEP 1 — Organization Setup */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Organization Setup
                </h2>
                <p className="mt-4 text-base sm:text-lg font-medium text-slate-500">
                  Configure your global clinical workspace and data residency preferences.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                  {/* Org Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Legal Organization Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        value={organization.name}
                        onChange={(e) => updateOrg('name', e.target.value)}
                        aria-label="Legal Organization Name"
                        placeholder="e.g. Northshore Health Group"
                        className="h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Slug */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Workspace Slug
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">/</span>
                        <input
                          value={organization.slug}
                          onChange={(e) => updateOrg('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                          aria-label="Workspace URL Slug"
                          placeholder="northshore"
                          className="h-14 w-full rounded-2xl border border-slate-200 pl-8 pr-4 text-sm font-bold font-mono outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                        />
                      </div>
                    </div>

                    {/* Org Type */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Organization Type
                      </label>
                      <select
                        value={organization.type}
                        onChange={(e) => updateOrg('type', e.target.value as OrganizationType)}
                        aria-label="Healthcare Organization Type"
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none appearance-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      >
                        {ORG_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Hospital Size */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Organization Size
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {HOSPITAL_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateOrg('hospitalSize', size)}
                          className={cn(
                            'rounded-2xl border p-4 text-left text-xs font-bold transition-all',
                            organization.hospitalSize === size
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Workspace Timezone
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <select
                        value={organization.timezone}
                        onChange={(e) => updateOrg('timezone', e.target.value)}
                        aria-label="Workspace Preferred Timezone"
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold text-slate-900 outline-none appearance-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      >
                        <option>UTC-5 (EST) — Eastern Standard Time</option>
                        <option>UTC-8 (PST) — Pacific Standard Time</option>
                        <option>UTC+0 (GMT) — Greenwich Mean Time</option>
                        <option>UTC+1 (CET) — Central European Time</option>
                        <option>UTC+5:30 (IST) — India Standard Time</option>
                        <option>UTC+8 (SGT) — Singapore Standard Time</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Target Cloud Region
                    </label>
                    <RegionSelector
                      value={organization.region}
                      onChange={(r) => updateOrg('region', r)}
                    />
                  </div>

                  {/* HIPAA card */}
                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-xl shadow-blue-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-5 w-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">HIPAA Guard Active</span>
                    </div>
                    <p className="text-sm font-medium opacity-90 leading-relaxed">
                      Data residency is strictly enforced. Your clinical data will never leave the{' '}
                      <span className="font-bold underline underline-offset-4 decoration-blue-300">
                        {organization.region}
                      </span>{' '}
                      perimeter.
                    </p>
                  </div>

                  {/* Preview card */}
                  {organization.name && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Workspace Preview</p>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-900">{organization.name}</p>
                        <p className="text-xs font-mono text-slate-500">
                          app.medibridgex.io/<span className="text-blue-600">{organization.slug || organization.name.toLowerCase().replace(/\s+/g, '-')}</span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{organization.type}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{organization.hospitalSize}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Infrastructure Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Infrastructure Selection
                </h2>
                <p className="mt-4 text-base sm:text-lg font-medium text-slate-500">
                  Pick the modules required for your interoperability needs. Each is provisioned on a dedicated cluster.
                </p>
              </div>
              <InfrastructureSelector modules={infrastructure} onChange={toggleInfra} />
            </motion.div>
          )}

          {/* STEP 3 — Infrastructure Preferences */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Infrastructure Preferences
                </h2>
                <p className="mt-4 text-base sm:text-lg font-medium text-slate-500">
                  Configure your FHIR version, HL7 support, and data residency for your clinical pipeline.
                </p>
              </div>
              <InfraPreferencesStep
                fhirVersion={infraPreferences.fhirVersion}
                hl7Support={infraPreferences.hl7Support}
                cloudRegion={infraPreferences.cloudRegion}
                realtimeStreaming={infraPreferences.realtimeStreaming}
                onFhirChange={(v) => updateInfraPref('fhirVersion', v)}
                onHl7Toggle={() => updateInfraPref('hl7Support', !infraPreferences.hl7Support)}
                onRegionChange={(r) => updateInfraPref('cloudRegion', r)}
                onStreamingToggle={() => updateInfraPref('realtimeStreaming', !infraPreferences.realtimeStreaming)}
              />
            </motion.div>
          )}

          {/* STEP 4 — Compliance */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Security & Compliance
                </h2>
                <p className="mt-4 text-base sm:text-lg font-medium text-slate-500">
                  Enable advanced security controls and compliance monitoring for your workspace.
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <ComplianceSetup settings={compliance} onChange={updateCompliance} />
              </div>
            </motion.div>
          )}

          {/* STEP 5 — Team Invites */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Team Management
                </h2>
                <p className="mt-4 text-base sm:text-lg font-medium text-slate-500">
                  Invite infrastructure administrators and clinical operators to your new workspace.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-blue-600">You are the Organization Admin</span>
                </div>
              </div>
              <div className="max-w-3xl mx-auto">
                <TeamInvite
                  members={team}
                  onAdd={addTeamMember}
                  onRemove={removeTeamMember}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER NAV */}
      <footer className="fixed bottom-0 left-0 z-40 w-full border-t border-slate-200 bg-white/90 backdrop-blur-xl p-4 lg:p-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            onClick={prevStep}
            aria-label="Go to previous step"
            className={cn(
              'flex h-12 lg:h-14 items-center gap-2 rounded-xl lg:rounded-2xl px-4 lg:px-6 text-[10px] lg:text-sm font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 hover:text-slate-950',
              step === 1 && 'invisible'
            )}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden md:block text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Environment Readiness
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        i <= step ? 'w-4 bg-blue-600' : 'w-3 bg-slate-200'
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Step {step} of 5 — {Math.round((step / 5) * 100)}% Complete
              </p>
            </div>

            <button
              onClick={nextStep}
              disabled={isLoading || (step === 1 && !organization.name)}
              aria-label={step === 5 ? 'Provision Workspace' : 'Continue to next step'}
              className="group flex h-14 lg:h-16 items-center gap-3 rounded-xl lg:rounded-2xl bg-blue-600 px-8 lg:px-12 text-[10px] lg:text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {step === 5 ? 'Provision Workspace' : 'Continue'}
                  </span>
                  <span className="sm:hidden">{step === 5 ? 'Finish' : 'Next'}</span>
                  <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

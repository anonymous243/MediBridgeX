import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  OnboardingState,
  OnboardingStep,
  InfrastructureModule,
  TeamMember,
  OrganizationType,
  HospitalSize,
  FhirVersion,
  AccountDetails,
} from '@/types/onboarding';
import { OnboardingService } from '@/services/onboarding.service';

interface WorkspaceState {
  // Step 0 — captured at sign-up
  accountDetails: AccountDetails | null;

  // Onboarding / Workspace Setup
  step: OnboardingStep;
  organization: OnboardingState['organization'];
  infrastructure: InfrastructureModule[];
  infraPreferences: OnboardingState['infraPreferences'];
  compliance: OnboardingState['compliance'];
  team: TeamMember[];

  // App State
  isLoading: boolean;
  error: string | null;
  workspaceId: string | null;
  onboardingCompleted: boolean;

  // Actions
  setAccountDetails: (details: AccountDetails) => void;
  setStep: (step: OnboardingStep) => void;
  updateOrg: <K extends keyof OnboardingState['organization']>(key: K, value: OnboardingState['organization'][K]) => void;
  toggleInfra: (id: string) => void;
  updateInfraPref: <K extends keyof OnboardingState['infraPreferences']>(key: K, value: OnboardingState['infraPreferences'][K]) => void;
  updateCompliance: (key: keyof OnboardingState['compliance'], value: boolean) => void;
  addTeamMember: (member: TeamMember) => void;
  removeTeamMember: (email: string) => void;
  resetOnboarding: () => void;

  // Async Actions
  initialize: () => Promise<void>;
  submitOnboarding: () => Promise<boolean>;
}

const DEFAULT_INFRA_PREFS: OnboardingState['infraPreferences'] = {
  hl7Support: true,
  fhirVersion: 'FHIR R4',
  cloudRegion: 'US East (N. Virginia)',
  realtimeStreaming: true,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      accountDetails: null,
      step: 1,
      organization: {
        name: '',
        type: 'Hospital Network',
        slug: '',
        timezone: 'UTC-5 (EST)',
        region: 'US East (N. Virginia)',
        hospitalSize: 'Medium (100–500 beds)',
      },
      infrastructure: [],
      infraPreferences: DEFAULT_INFRA_PREFS,
      compliance: {
        mfa: true,
        auditLogging: true,
        hipaaControls: true,
        encryption: true,
        sessionTimeout: true,
        deviceTrust: false,
      },
      team: [],
      isLoading: false,
      error: null,
      workspaceId: null,
      onboardingCompleted: false,

      setAccountDetails: (details) => set({ accountDetails: details }),

      setStep: (step) => set({ step }),

      updateOrg: (key, value) =>
        set((state) => ({
          organization: { ...state.organization, [key]: value },
        })),

      toggleInfra: (id) =>
        set((state) => ({
          infrastructure: state.infrastructure.map((m) =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
          ),
        })),

      updateInfraPref: (key, value) =>
        set((state) => ({
          infraPreferences: { ...state.infraPreferences, [key]: value },
        })),

      updateCompliance: (key, value) =>
        set((state) => ({
          compliance: { ...state.compliance, [key]: value },
        })),

      addTeamMember: (member) =>
        set((state) => ({
          team: [...state.team, member],
        })),

      removeTeamMember: (email) =>
        set((state) => ({
          team: state.team.filter((m) => m.email !== email),
        })),

      resetOnboarding: () =>
        set({
          accountDetails: null,
          step: 1,
          organization: {
            name: '',
            type: 'Hospital Network',
            slug: '',
            timezone: 'UTC-5 (EST)',
            region: 'US East (N. Virginia)',
            hospitalSize: 'Medium (100–500 beds)',
          },
          infrastructure: [],
          infraPreferences: DEFAULT_INFRA_PREFS,
          compliance: {
            mfa: true,
            auditLogging: true,
            hipaaControls: true,
            encryption: true,
            sessionTimeout: true,
            deviceTrust: false,
          },
          team: [],
          workspaceId: null,
          onboardingCompleted: false,
        }),

      initialize: async () => {
        if (get().infrastructure.length > 0) return;

        set({ isLoading: true, error: null });
        try {
          const initialState = await OnboardingService.getInitialState();
          set({
            organization: {
              ...initialState.organization,
              hospitalSize: 'Medium (100–500 beds)',
            },
            infrastructure: initialState.infrastructure,
            compliance: initialState.compliance,
            isLoading: false,
          });
        } catch (err) {
          set({ error: 'Failed to initialize workspace', isLoading: false });
        }
      },

      submitOnboarding: async () => {
        set({ isLoading: true, error: null });
        try {
          const { organization, infrastructure, infraPreferences, compliance, team } = get();
          const response = await OnboardingService.submitOnboarding({
            organization,
            infrastructure,
            infraPreferences,
            compliance,
            team,
          });

          if (response.success) {
            set({
              workspaceId: response.workspaceId,
              onboardingCompleted: true,
              isLoading: false,
            });
            return true;
          }
          return false;
        } catch (err) {
          set({ error: 'Provisioning failed', isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'medibridgex-workspace-storage',
      partialize: (state) => ({
        accountDetails: state.accountDetails,
        step: state.step,
        organization: state.organization,
        infrastructure: state.infrastructure,
        infraPreferences: state.infraPreferences,
        compliance: state.compliance,
        team: state.team,
        onboardingCompleted: state.onboardingCompleted,
      }),
    }
  )
);

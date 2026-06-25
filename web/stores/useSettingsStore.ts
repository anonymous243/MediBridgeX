import { create } from 'zustand';
import { SettingsService, UserSettings } from '@/services/settings.service';
import { OnboardingState, TeamMember } from '@/types/onboarding';

interface SettingsState {
  activeTab: string;
  settings: UserSettings | null;
  organization: OnboardingState['organization'] | null;
  team: TeamMember[];
  compliance: OnboardingState['compliance'] | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  setActiveTab: (tab: string) => void;
  fetchSettings: () => Promise<void>;
  fetchOrganization: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  fetchCompliance: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateOrganization: (org: Partial<OnboardingState['organization']>) => Promise<void>;
  toggleNotification: (key: keyof UserSettings['notifications']) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  activeTab: 'org',
  settings: null,
  organization: null,
  team: [],
  compliance: null,
  isLoading: false,
  isSaving: false,
  error: null,

  setActiveTab: (activeTab) => set({ activeTab }),

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const [settings, organization, team, compliance] = await Promise.all([
        SettingsService.getSettings(),
        SettingsService.getOrganization(),
        SettingsService.getTeamMembers(),
        SettingsService.getCompliance()
      ]);
      set({ settings, organization, team, compliance, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch settings', isLoading: false });
    }
  },

  fetchOrganization: async () => {
    try {
      const organization = await SettingsService.getOrganization();
      set({ organization });
    } catch (err) {
      set({ error: 'Failed to fetch organization' });
    }
  },

  fetchTeam: async () => {
    try {
      const team = await SettingsService.getTeamMembers();
      set({ team });
    } catch (err) {
      set({ error: 'Failed to fetch team' });
    }
  },

  fetchCompliance: async () => {
    try {
      const compliance = await SettingsService.getCompliance();
      set({ compliance });
    } catch (err) {
      set({ error: 'Failed to fetch compliance' });
    }
  },

  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    if (!currentSettings) return;

    set({ isSaving: true });
    try {
      const success = await SettingsService.updateSettings(newSettings);
      if (success) {
        set({ settings: { ...currentSettings, ...newSettings }, isSaving: false });
      }
    } catch (err) {
      set({ error: 'Failed to update settings', isSaving: false });
    }
  },

  updateOrganization: async (newOrg) => {
    const currentOrg = get().organization;
    if (!currentOrg) return;

    set({ isSaving: true });
    try {
      await SettingsService.updateOrganization(newOrg);
      set({ organization: { ...currentOrg, ...newOrg }, isSaving: false });
    } catch (err) {
      set({ error: 'Failed to update organization', isSaving: false });
    }
  },

  toggleNotification: async (key) => {
    const currentSettings = get().settings;
    if (!currentSettings) return;

    const newNotifications = {
      ...currentSettings.notifications,
      [key]: !currentSettings.notifications[key]
    };

    await get().updateSettings({ notifications: newNotifications });
  }
}));

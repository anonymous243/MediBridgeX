import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { OnboardingState, TeamMember } from '@/types/onboarding';

export interface UserSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
    clinicalAlerts: boolean;
  };
  language: string;
}

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    if (API_CONFIG.MOCK_MODE) {
      return {
        id: 'u_123',
        theme: 'system',
        notifications: {
          email: true,
          push: false,
          slack: true,
          clinicalAlerts: true
        },
        language: 'en-US'
      };
    }
    return apiClient.get<UserSettings>('/settings/user');
  },

  async updateSettings(data: Partial<UserSettings>): Promise<boolean> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
    await apiClient.patch('/settings/user', data);
    return true;
  },

  async getOrganization(): Promise<OnboardingState['organization']> {
    if (API_CONFIG.MOCK_MODE) {
      return {
        name: 'Northshore Health Group',
        type: 'Hospital Network',
        slug: 'northshore',
        timezone: 'UTC-5 (EST)',
        region: 'US East (N. Virginia)',
        hospitalSize: 'Large (500–2000 beds)',
      };
    }
    return apiClient.get<OnboardingState['organization']>(API_CONFIG.ENDPOINTS.SETTINGS.ORG);
  },

  async updateOrganization(data: Partial<OnboardingState['organization']>): Promise<void> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    return apiClient.patch(API_CONFIG.ENDPOINTS.SETTINGS.ORG, data);
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    if (API_CONFIG.MOCK_MODE) {
      return [
        { email: 'sarah.chen@northshore.org', role: 'admin' },
        { email: 'm.ross@northshore.org', role: 'operator' },
        { email: 'dev-ops@northshore.org', role: 'developer' }
      ];
    }
    return apiClient.get<TeamMember[]>(API_CONFIG.ENDPOINTS.SETTINGS.TEAM);
  },

  async getCompliance(): Promise<OnboardingState['compliance']> {
    if (API_CONFIG.MOCK_MODE) {
      return {
        mfa: true,
        auditLogging: true,
        hipaaControls: true,
        encryption: true,
        sessionTimeout: true,
        deviceTrust: false,
      };
    }
    return apiClient.get<OnboardingState['compliance']>(API_CONFIG.ENDPOINTS.SETTINGS.COMPLIANCE);
  }
};

export const SettingsService = settingsService;

import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { OnboardingState } from '@/types/onboarding';

export class OnboardingService {
  static async getInitialState(): Promise<OnboardingState> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        organization: {
          name: '',
          type: 'Hospital Network',
          slug: '',
          timezone: 'UTC-5 (EST)',
          region: 'US East (N. Virginia)',
          hospitalSize: 'Medium (100–500 beds)',
        },
        infrastructure: [
          { id: 'hl7', name: 'HL7 v2 Messaging', description: 'Real-time ingestion of ADT, ORM, and ORU clinical messages.', enabled: true, icon: 'activity' },
          { id: 'fhir', name: 'FHIR APIs', description: 'Managed R4 server with advanced search and clinical resource mapping.', enabled: true, icon: 'database' },
          { id: 'dicom', name: 'DICOM Imaging', description: 'Secure storage and web-viewing for medical imaging studies.', enabled: false, icon: 'layers' },
          { id: 'webhooks', name: 'Webhook Integrations', description: 'Event-driven notifications for clinical state changes.', enabled: true, icon: 'webhook' },
          { id: 'api', name: 'API Gateway', description: 'Centralized authentication, rate limiting, and dev credentials.', enabled: true, icon: 'zap' },
          { id: 'audit', name: 'Audit Logging', description: 'Immutable records for every clinical transaction and system access.', enabled: true, icon: 'shield' },
          { id: 'streaming', name: 'Event Streaming', description: 'High-throughput Kafka queues for real-time data distribution.', enabled: false, icon: 'boxes' },
        ],
        infraPreferences: {
          hl7Support: true,
          fhirVersion: 'FHIR R4',
          cloudRegion: 'US East (N. Virginia)',
          realtimeStreaming: true,
        },
        compliance: {
          mfa: true,
          auditLogging: true,
          hipaaControls: true,
          encryption: true,
          sessionTimeout: true,
          deviceTrust: false,
        },
        team: [],
      };
    }
    return apiClient.get<OnboardingState>(API_CONFIG.ENDPOINTS.ONBOARDING.STATUS);
  }

  static async submitOnboarding(state: OnboardingState): Promise<{ success: boolean; workspaceId: string }> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        workspaceId: `ws_${Math.random().toString(36).substring(7)}`,
      };
    }
    return apiClient.post<{ success: boolean; workspaceId: string }>(API_CONFIG.ENDPOINTS.ONBOARDING.SUBMIT, state);
  }

  static async validateSlug(slug: string): Promise<boolean> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const reservedSlugs = ['admin', 'api', 'auth', 'dashboard'];
      return !reservedSlugs.includes(slug.toLowerCase()) && slug.length >= 3;
    }
    return apiClient.get<boolean>(`/onboarding/validate-slug`, { params: { slug } });
  }
}

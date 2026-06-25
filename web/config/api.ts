/**
 * MediBridgeX API Configuration
 * Supports environment-based configuration for local, staging, and production.
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000, // 30 seconds
  MOCK_MODE: process.env.NEXT_PUBLIC_MOCK_API === 'true',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
    },
    ONBOARDING: {
      SUBMIT: '/onboarding/submit',
      STATUS: '/onboarding/status',
    },
    FHIR: {
      RESOURCES: '/fhir/resources',
      RESOURCE: (id: string) => `/fhir/resources/${id}`,
      SEARCH: '/fhir/search',
      AUDIT: '/fhir/audit-logs',
    },
    MESSAGES: {
      STREAM: '/messages/stream',
      MESSAGE: (id: string) => `/messages/${id}`,
      METRICS: '/messages/metrics',
      RETRY: (id: string) => `/messages/${id}/retry`,
    },
    SETTINGS: {
      ORG: '/settings/organization',
      TEAM: '/settings/team',
      COMPLIANCE: '/settings/compliance',
    },
    DEVELOPERS: {
      KEYS: '/developers/api-keys',
      WEBHOOKS: '/developers/webhooks',
      LOGS: '/developers/logs',
      METRICS: '/developers/metrics',
    },
    INTEGRATIONS: {
      LIST: '/integrations',
      STATS: '/integrations/stats',
    },
  },
};

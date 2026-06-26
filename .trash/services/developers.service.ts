import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { ApiKey, WebhookEndpoint, ApiRequestLog, UsageMetric, WebhookDeliveryLog } from '@/types/developers';
import { ApiResponse, QueryParams } from '@/types/api';
import { 
  mockApiKeys, 
  mockWebhookEndpoints, 
  mockApiRequestLogs, 
  mockUsageMetrics,
  mockWebhookLogs 
} from '@/data/developers-mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const developersService = {
  async getApiKeys(): Promise<ApiKey[]> {
    if (API_CONFIG.MOCK_MODE) {
      await delay(500);
      return mockApiKeys;
    }
    return apiClient.get<ApiKey[]>(API_CONFIG.ENDPOINTS.DEVELOPERS.KEYS);
  },

  async createApiKey(name: string, environment: 'live' | 'test', scopes: string[]): Promise<ApiKey> {
    if (API_CONFIG.MOCK_MODE) {
      await delay(800);
      return {
        id: `key_${Math.random().toString(36).substring(7)}`,
        name,
        key: `mbx_${environment}_${Math.random().toString(36).substring(16)}`,
        status: 'active',
        environment,
        scopes,
        createdAt: new Date().toISOString()
      };
    }
    return apiClient.post<ApiKey>(API_CONFIG.ENDPOINTS.DEVELOPERS.KEYS, { name, environment, scopes });
  },

  async revokeApiKey(id: string): Promise<boolean> {
    if (API_CONFIG.MOCK_MODE) {
      await delay(500);
      return true;
    }
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.DEVELOPERS.KEYS}/${id}`);
    return true;
  },

  async getWebhooks(): Promise<WebhookEndpoint[]> {
    if (API_CONFIG.MOCK_MODE) {
      await delay(500);
      return mockWebhookEndpoints;
    }
    return apiClient.get<WebhookEndpoint[]>(API_CONFIG.ENDPOINTS.DEVELOPERS.WEBHOOKS);
  },

  async getApiLogs(params?: QueryParams): Promise<ApiResponse<ApiRequestLog[]>> {
    if (API_CONFIG.MOCK_MODE) {
      await delay(800);
      return {
        data: mockApiRequestLogs,
        meta: {
          total: mockApiRequestLogs.length,
          timestamp: new Date().toISOString(),
          requestId: 'req_logs_mock'
        }
      };
    }
    return apiClient.get<ApiResponse<ApiRequestLog[]>>(API_CONFIG.ENDPOINTS.DEVELOPERS.LOGS, { params });
  },

  async getUsageMetrics(): Promise<UsageMetric[]> {
    if (API_CONFIG.MOCK_MODE) {
      await delay(500);
      return mockUsageMetrics;
    }
    return apiClient.get<UsageMetric[]>(API_CONFIG.ENDPOINTS.DEVELOPERS.METRICS);
  },

  async getWebhookLogs(webhookId: string): Promise<WebhookDeliveryLog[]> {
    if (API_CONFIG.MOCK_MODE) {
      await delay(500);
      return mockWebhookLogs.filter(log => log.webhookId === webhookId);
    }
    return apiClient.get<WebhookDeliveryLog[]>(`${API_CONFIG.ENDPOINTS.DEVELOPERS.WEBHOOKS}/${webhookId}/logs`);
  }
};

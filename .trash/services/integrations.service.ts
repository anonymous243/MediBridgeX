import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { Integration } from '@/types/integration';
import { integrations as mockIntegrations } from '@/lib/mock-data/integrations';

export class IntegrationsService {
    static async getIntegrations(): Promise<Integration[]> {
        if (API_CONFIG.MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 800));
            return mockIntegrations;
        }
        return apiClient.get<Integration[]>(API_CONFIG.ENDPOINTS.INTEGRATIONS.LIST);
    }
}
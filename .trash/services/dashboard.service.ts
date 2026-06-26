import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';

export interface DashboardOverview {
  metrics: {
    messagesToday: number;
    fhirConversions: number;
    connectedSystems: number;
    complianceStatus: number;
  };
  trafficAnalytics: number[];
  liveSystems: {
    title: string;
    status: string;
    time: string;
  }[];
}

export class DashboardService {
  static async getOverview(): Promise<DashboardOverview> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        metrics: {
          messagesToday: 128492 + Math.floor(Math.random() * 1000),
          fhirConversions: 92104 + Math.floor(Math.random() * 500),
          connectedSystems: 148,
          complianceStatus: 99.99,
        },
        trafficAnalytics: [35, 52, 68, 49, 84, 96, 72, 88].map(v => v + Math.floor(Math.random() * 20 - 10)),
        liveSystems: [
          { title: 'Epic HL7 Feed', status: 'Healthy', time: '1 min ago' },
          { title: 'FHIR Gateway', status: 'Operational', time: '2 min ago' },
          { title: 'Radiology Pipeline', status: 'Processing', time: '5 min ago' },
          { title: 'Lab Sync Engine', status: 'Healthy', time: '12 min ago' },
        ],
      };
    }
    
    // Fallback if backend doesn't have an explicit dashboard overview endpoint yet
    try {
      return await apiClient.get<DashboardOverview>('/dashboard/overview');
    } catch (error) {
      // Return a safe empty state rather than crashing if endpoint is unavailable
      console.error('Failed to fetch dashboard overview', error);
      return {
        metrics: { messagesToday: 0, fhirConversions: 0, connectedSystems: 0, complianceStatus: 0 },
        trafficAnalytics: [],
        liveSystems: []
      };
    }
  }
}

import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { FhirResource } from '@/types/fhir';
import { ApiResponse, QueryParams } from '@/types/api';
import { mockFhirResources } from '@/data/fhir-mock';
import { useAuthStore } from '@/stores/useAuthStore';

export class FhirService {
  static async getResources(params?: QueryParams): Promise<FhirResource[]> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const user = useAuthStore.getState().user;
      if (!user) return [];
      if (user.role === 'super_admin') return mockFhirResources as FhirResource[];
      
      return mockFhirResources.filter(r => r.organizationId === user.organizationId) as FhirResource[];
    }
    const response = await apiClient.get<ApiResponse<FhirResource[]>>(API_CONFIG.ENDPOINTS.FHIR.RESOURCES, { params });
    return response.data;
  }

  static async getResource(id: string): Promise<FhirResource> {
    if (API_CONFIG.MOCK_MODE) {
      const resource = mockFhirResources.find(r => r.id === id);
      if (!resource) throw new Error('Resource not found');
      return resource as FhirResource;
    }
    return apiClient.get<FhirResource>(API_CONFIG.ENDPOINTS.FHIR.RESOURCE(id));
  }

  static async searchResources(query: string, type?: string): Promise<FhirResource[]> {
    if (API_CONFIG.MOCK_MODE) {
      const user = useAuthStore.getState().user;
      if (!user) return [];

      let filtered = mockFhirResources;
      if (user.role !== 'super_admin') {
        filtered = filtered.filter(r => r.organizationId === user.organizationId);
      }

      filtered = filtered.filter(r => 
        r.id.toLowerCase().includes(query.toLowerCase()) || 
        r.patientName?.toLowerCase().includes(query.toLowerCase())
      );
      if (type) {
        filtered = filtered.filter(r => r.resourceType === type);
      }
      return filtered as FhirResource[];
    }
    const response = await apiClient.get<ApiResponse<FhirResource[]>>(API_CONFIG.ENDPOINTS.FHIR.SEARCH, { params: { q: query, type } });
    return response.data;
  }

  static async syncResource(id: string): Promise<boolean> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    }
    await apiClient.post(`/fhir/resources/${id}/sync`);
    return true;
  }
}

export default FhirService;
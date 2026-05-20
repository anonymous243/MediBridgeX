import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { Message, PipelineMetrics, MessageActivity } from '@/types/message';
import { ApiResponse, QueryParams } from '@/types/api';
import { useAuthStore } from '@/stores/useAuthStore';

const mockMessages: Message[] = [
  {
    id: 'msg_01J2K3L4',
    correlationId: 'corr_88291-abc-992',
    sourceSystem: 'Epic OMR',
    messageType: 'ADT^A01',
    status: 'Validated',
    timestamp: new Date().toISOString(),
    region: 'US-EAST',
    patientName: 'John Doe',
    organizationId: 'org_A',
    rawPayload: 'MSH|^~\\&|EPIC|NORTHSHORE|MBX|MEDIBRIDGEX|202405161000||ADT^A01|...',
    transformedPayload: '{"resourceType": "Patient", "id": "p1", "name": [{"family": "Doe", "given": ["John"]}]}',
    validationResults: { score: 100, issues: [] },
    pipelineHistory: [
      { id: '1', name: 'Inbound Reception', status: 'success', timestamp: new Date().toISOString(), durationMs: 12 },
      { id: '2', name: 'HL7 Parsing', status: 'success', timestamp: new Date().toISOString(), durationMs: 45 },
      { id: '3', name: 'FHIR Transformation', status: 'success', timestamp: new Date().toISOString(), durationMs: 120 }
    ],
    retryCount: 0,
    metadata: { facility: 'Northshore General', department: 'Emergency' }
  },
  {
    id: 'msg_01J2K3L5',
    correlationId: 'corr_88291-abc-993',
    sourceSystem: 'Cerner Millennium',
    messageType: 'ORM^O01',
    status: 'Processing',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    region: 'US-WEST',
    patientName: 'Jane Smith',
    organizationId: 'org_A',
    rawPayload: '...',
    transformedPayload: '...',
    validationResults: { score: 92, issues: [] },
    pipelineHistory: [
      { id: '1', name: 'Inbound Reception', status: 'success', timestamp: new Date().toISOString(), durationMs: 15 },
      { id: '2', name: 'HL7 Parsing', status: 'success', timestamp: new Date().toISOString(), durationMs: 38 }
    ],
    retryCount: 1,
    metadata: { facility: 'West Coast Medical', department: 'Radiology' }
  },
  {
    id: 'msg_01J2K3L6',
    correlationId: 'corr_88291-abc-994',
    sourceSystem: 'Allscripts',
    messageType: 'SIU^S12',
    status: 'Failed',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    region: 'EU-CENTRAL',
    patientName: 'Robert Brown',
    organizationId: 'org_B',
    rawPayload: '...',
    transformedPayload: '...',
    validationResults: { score: 45, issues: [{ severity: 'error', code: 'HL7_PARSING_ERROR', details: 'Missing required field MSH-9' }] },
    pipelineHistory: [
      { id: '1', name: 'Inbound Reception', status: 'success', timestamp: new Date().toISOString(), durationMs: 10 },
      { id: '2', name: 'HL7 Parsing', status: 'failure', timestamp: new Date().toISOString(), details: 'Critical Parse Error: Invalid segment terminator' }
    ],
    retryCount: 3,
    metadata: { facility: 'Berlin Health Center', department: 'Outpatient' }
  }
];

export class MessagesService {
  static async getMessages(params?: QueryParams): Promise<Message[]> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = useAuthStore.getState().user;
      
      if (!user) return [];
      if (user.role === 'super_admin') return mockMessages;
      
      return mockMessages.filter(msg => msg.organizationId === user.organizationId);
    }
    const response = await apiClient.get<ApiResponse<Message[]>>(API_CONFIG.ENDPOINTS.MESSAGES.STREAM, { params });
    return response.data;
  }

  static async getPipelineMetrics(): Promise<PipelineMetrics> {
    if (API_CONFIG.MOCK_MODE) {
      return {
        queueThroughput: 1284,
        failedRate: 0.12,
        retryCount: 42,
        processingLatency: 89,
        deliverySuccessRate: 99.88,
        regionalHealth: {
          'US-EAST': 'healthy',
          'EU-CENTRAL': 'healthy',
          'AP-SOUTH': 'degraded'
        }
      };
    }
    return apiClient.get<PipelineMetrics>(API_CONFIG.ENDPOINTS.MESSAGES.METRICS);
  }

  static async getActivities(): Promise<MessageActivity[]> {
    if (API_CONFIG.MOCK_MODE) {
      return [
        { id: '1', type: 'info', message: 'Inbound stream connected: EPIC_PROD', timestamp: new Date().toISOString() },
        { id: '2', type: 'warning', message: 'Latency spike detected in AP-SOUTH', timestamp: new Date(Date.now() - 1000 * 60).toISOString() },
        { id: '3', type: 'error', message: 'Connection lost to CERNER_UK_01', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
      ];
    }
    return apiClient.get<MessageActivity[]>('/messages/activities');
  }

  static async replayMessage(id: string): Promise<boolean> {
    if (API_CONFIG.MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
    await apiClient.post(API_CONFIG.ENDPOINTS.MESSAGES.RETRY(id));
    return true;
  }
}

export const MessageService = MessagesService;
export default MessagesService;
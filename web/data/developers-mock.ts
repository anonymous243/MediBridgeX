import { ApiKey, WebhookEndpoint, ApiRequestLog, UsageMetric, WebhookDeliveryLog } from '@/types/developers';

export const mockApiKeys: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production Mobile App',
    key: 'mbx_live_51Pq...8k2Z',
    status: 'active',
    environment: 'live',
    scopes: ['patient.read', 'observation.read', 'encounter.write'],
    createdAt: '2026-01-15T10:00:00Z',
    lastUsedAt: '2026-05-12T08:30:00Z',
  },
  {
    id: 'key_2',
    name: 'Staging Integration Test',
    key: 'mbx_test_92v...k9L1',
    status: 'active',
    environment: 'test',
    scopes: ['*.read', '*.write'],
    createdAt: '2026-03-20T14:20:00Z',
    lastUsedAt: '2026-05-11T22:15:00Z',
  },
  {
    id: 'key_3',
    name: 'Legacy Analytics Sync',
    key: 'mbx_live_12a...m3P9',
    status: 'revoked',
    environment: 'live',
    scopes: ['patient.read'],
    createdAt: '2025-11-05T09:00:00Z',
    lastUsedAt: '2025-12-30T16:45:00Z',
  },
];

export const mockWebhookEndpoints: WebhookEndpoint[] = [
  {
    id: 'wh_1',
    url: 'https://api.healthsync.io/webhooks/medibridgex',
    status: 'active',
    events: ['patient.created', 'observation.updated'],
    description: 'Main production sync endpoint',
    createdAt: '2026-01-20T11:00:00Z',
    signingSecret: 'whsec_9b2...k8s2',
  },
  {
    id: 'wh_2',
    url: 'https://dev-hooks.careflow.com/receive',
    status: 'failed',
    events: ['encounter.started', 'encounter.finished'],
    description: 'Development environment listener',
    createdAt: '2026-04-05T15:30:00Z',
    signingSecret: 'whsec_1a4...m2p9',
  },
];

export const mockApiRequestLogs: ApiRequestLog[] = [
  {
    id: 'req_1',
    method: 'GET',
    endpoint: '/fhir/Patient/pat_9281',
    statusCode: 200,
    latency: 142,
    timestamp: '2026-05-12T09:15:22Z',
    requestId: 'req_v2_9k2m...82nL',
    correlationId: 'corr_82j1...m9P',
    retryCount: 0,
    userAgent: 'MediBridgeX-TS-SDK/1.4.2',
  },
  {
    id: 'req_2',
    method: 'POST',
    endpoint: '/fhir/Observation',
    statusCode: 201,
    latency: 285,
    timestamp: '2026-05-12T09:12:45Z',
    requestId: 'req_v2_1a2s...k29M',
    correlationId: 'corr_2n3l...p8W',
    retryCount: 0,
    userAgent: 'curl/7.68.0',
    requestBody: {
      resourceType: 'Observation',
      status: 'final',
      code: { coding: [{ system: 'http://loinc.org', code: '85354-9' }] },
      subject: { reference: 'Patient/pat_9281' },
      valueQuantity: { value: 120, unit: 'mmHg' },
    },
  },
  {
    id: 'req_3',
    method: 'GET',
    endpoint: '/fhir/Encounter?patient=pat_9281',
    statusCode: 429,
    latency: 12,
    timestamp: '2026-05-12T09:10:10Z',
    requestId: 'req_v2_m92p...l12S',
    correlationId: 'corr_1a2s...k29M',
    retryCount: 2,
    userAgent: 'MediBridgeX-Python-SDK/2.1.0',
  },
];

export const mockUsageMetrics: UsageMetric[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `2026-05-12T${i.toString().padStart(2, '0')}:00:00Z`,
  requests: Math.floor(Math.random() * 1000) + 500,
  errors: Math.floor(Math.random() * 20),
  latency: Math.floor(Math.random() * 150) + 50,
}));

export const mockWebhookLogs: WebhookDeliveryLog[] = [
  {
    id: 'log_1',
    webhookId: 'wh_1',
    event: 'patient.created',
    status: 'success',
    statusCode: 200,
    latency: 450,
    timestamp: '2026-05-12T09:15:00Z',
    requestBody: { id: 'pat_9281', resourceType: 'Patient' },
    responseBody: { success: true },
  },
  {
    id: 'log_2',
    webhookId: 'wh_1',
    event: 'observation.updated',
    status: 'failed',
    statusCode: 502,
    latency: 1200,
    timestamp: '2026-05-12T09:10:00Z',
    requestBody: { id: 'obs_102', resourceType: 'Observation' },
    responseBody: { error: 'Bad Gateway' },
  },
];

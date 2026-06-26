export type ApiKeyStatus = 'active' | 'revoked' | 'expired';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: ApiKeyStatus;
  environment: 'live' | 'test';
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export type WebhookStatus = 'active' | 'inactive' | 'failed';

export interface WebhookEndpoint {
  id: string;
  url: string;
  status: WebhookStatus;
  events: string[];
  description?: string;
  createdAt: string;
  signingSecret: string;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed';
  statusCode: number;
  latency: number;
  timestamp: string;
  requestBody: unknown;
  responseBody: unknown;
}

export interface ApiRequestLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  statusCode: number;
  latency: number;
  timestamp: string;
  requestId: string;
  correlationId: string;
  retryCount: number;
  userAgent: string;
  requestBody?: unknown;
  responseBody?: unknown;
}

export interface UsageMetric {
  timestamp: string;
  requests: number;
  errors: number;
  latency: number;
}

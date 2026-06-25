export type MessageStatus =
    | 'Processing'
    | 'Queued'
    | 'Validated'
    | 'Failed'
    | 'Retrying'
    | 'Delivered';

export interface MessageValidationIssue {
    severity: 'error' | 'warning' | 'information';
    code: string;
    details: string;
    location?: string;
}

export interface PipelineStep {
    id: string;
    name: string;
    status: 'success' | 'failure' | 'pending' | 'processing';
    timestamp: string;
    durationMs?: number;
    details?: string;
}

export interface Message {
    id: string;
    correlationId: string;
    sourceSystem: string;
    messageType: string; // e.g., ADT^A01, ORM^O01
    status: MessageStatus;
    timestamp: string;
    region: string;
    organizationId?: string;
    patientId?: string;
    patientName?: string;
    
    // Payloads
    rawPayload: string; // HL7
    transformedPayload: string; // FHIR JSON
    
    // Observability
    validationResults: {
        score: number;
        issues: MessageValidationIssue[];
    };
    pipelineHistory: PipelineStep[];
    retryCount: number;
    lastError?: string;
    
    metadata: Record<string, any>;
}

export interface PipelineMetrics {
    queueThroughput: number; // msgs/sec
    failedRate: number; // percentage
    retryCount: number;
    processingLatency: number; // ms
    deliverySuccessRate: number;
    regionalHealth: Record<string, 'healthy' | 'degraded' | 'down'>;
}

export interface MessageActivity {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
import { Message } from '../../types/message';

export const messages: Message[] = [
    {
        id: 'MSG-001',
        correlationId: 'COR-001',
        sourceSystem: 'Epic EHR',
        messageType: 'HL7 ADT',
        status: 'Delivered',
        timestamp: '2024-05-11T12:00:00Z',
        region: 'US-EAST',
        rawPayload: '',
        transformedPayload: '',
        validationResults: { score: 100, issues: [] },
        pipelineHistory: [],
        retryCount: 0,
        metadata: {}
    }
];
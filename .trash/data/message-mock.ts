import { Message } from '../types/message';

export const mockMessages: Message[] = [
    {
        id: 'MSG-99281',
        correlationId: 'COR-001-X92',
        sourceSystem: 'Epic OMR',
        messageType: 'ADT^A01',
        status: 'Delivered',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
        region: 'US-EAST',
        patientId: 'PT-8827',
        patientName: 'Sarah Connor',
        rawPayload: 'MSH|^~\\&|EPIC|ST_ANTHONY|MEDIBRIDGEX|CENTRAL|202405111200||ADT^A01|MSG-99281|P|2.5\nEVN||202405111200\nPID|||PT-8827||Connor^Sarah||19850512|F',
        transformedPayload: JSON.stringify({
            resourceType: 'Patient',
            id: 'PT-8827',
            name: [{ family: 'Connor', given: ['Sarah'] }],
            gender: 'female',
            birthDate: '1985-05-12'
        }, null, 2),
        validationResults: {
            score: 100,
            issues: []
        },
        pipelineHistory: [
            { id: '1', name: 'Ingestion', status: 'success', timestamp: '2024-05-11T12:00:00Z', durationMs: 12 },
            { id: '2', name: 'Schema Validation', status: 'success', timestamp: '2024-05-11T12:00:01Z', durationMs: 45 },
            { id: '3', name: 'FHIR Transformation', status: 'success', timestamp: '2024-05-11T12:00:02Z', durationMs: 89 },
            { id: '4', name: 'Delivery', status: 'success', timestamp: '2024-05-11T12:00:03Z', durationMs: 230 }
        ],
        retryCount: 0,
        metadata: {
            facility: 'St. Anthony Hospital',
            department: 'Emergency'
        }
    },
    {
        id: 'MSG-99282',
        correlationId: 'COR-002-Y83',
        sourceSystem: 'Cerner Hub',
        messageType: 'ORM^O01',
        status: 'Failed',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        region: 'US-WEST',
        patientId: 'PT-1102',
        patientName: 'James Holden',
        rawPayload: 'MSH|^~\\&|CERNER|MCR|MEDIBRIDGEX|CENTRAL|202405111205||ORM^O01|MSG-99282|P|2.3\nPID|||PT-1102||Holden^James\nPV1||I|ER',
        transformedPayload: '{}',
        validationResults: {
            score: 45,
            issues: [
                { severity: 'error', code: 'REQUIRED_FIELD_MISSING', details: 'OBR segment missing mandatory field OBR.4 (Universal Service ID)', location: 'OBR.4' }
            ]
        },
        pipelineHistory: [
            { id: '1', name: 'Ingestion', status: 'success', timestamp: '2024-05-11T12:05:00Z', durationMs: 15 },
            { id: '2', name: 'Schema Validation', status: 'failure', timestamp: '2024-05-11T12:05:01Z', durationMs: 32, details: 'Validation failed at OBR segment' }
        ],
        retryCount: 3,
        lastError: 'Validation failed: Required field OBR.4 is missing.',
        metadata: {
            facility: 'Mayo Clinic',
            env: 'Production'
        }
    },
    {
        id: 'MSG-99283',
        correlationId: 'COR-003-Z74',
        sourceSystem: 'Azure Health',
        messageType: 'ORU^R01',
        status: 'Processing',
        timestamp: new Date(Date.now() - 1000 * 10).toISOString(), // 10 secs ago
        region: 'EU-CENTRAL',
        patientId: 'PT-4432',
        patientName: 'Amos Burton',
        rawPayload: 'MSH|^~\\&|AZURE|HLTH|MEDIBRIDGEX|CENTRAL|202405111210||ORU^R01|MSG-99283|P|2.5',
        transformedPayload: '{}',
        validationResults: {
            score: 0,
            issues: []
        },
        pipelineHistory: [
            { id: '1', name: 'Ingestion', status: 'success', timestamp: '2024-05-11T12:10:00Z', durationMs: 8 },
            { id: '2', name: 'Schema Validation', status: 'processing', timestamp: '2024-05-11T12:10:01Z' }
        ],
        retryCount: 0,
        metadata: {
            source: 'Cloud Gateway'
        }
    },
    {
        id: 'MSG-99284',
        correlationId: 'COR-004-W65',
        sourceSystem: 'Epic OMR',
        messageType: 'ADT^A08',
        status: 'Retrying',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
        region: 'US-EAST',
        patientId: 'PT-9901',
        patientName: 'Naomi Nagata',
        rawPayload: 'MSH|^~\\&|EPIC|ST_ANTHONY|MEDIBRIDGEX|CENTRAL|202405111155||ADT^A08|MSG-99284|P|2.5',
        transformedPayload: '{}',
        validationResults: {
            score: 100,
            issues: []
        },
        pipelineHistory: [
            { id: '1', name: 'Ingestion', status: 'success', timestamp: '2024-05-11T11:55:00Z', durationMs: 14 },
            { id: '2', name: 'Schema Validation', status: 'success', timestamp: '2024-05-11T11:55:01Z', durationMs: 40 },
            { id: '3', name: 'FHIR Transformation', status: 'success', timestamp: '2024-05-11T11:55:02Z', durationMs: 76 },
            { id: '4', name: 'Delivery', status: 'failure', timestamp: '2024-05-11T11:55:10Z', durationMs: 5000, details: 'Endpoint timeout (504 Gateway Timeout)' }
        ],
        retryCount: 2,
        lastError: 'HTTP 504 Gateway Timeout on webhook delivery.',
        metadata: {
            target: 'Customer Endpoint'
        }
    }
];

import { FhirResource, ClinicalEvent } from '../types/fhir';

export const mockFhirResources: FhirResource[] = [
    {
        resourceType: 'Patient',
        id: 'pt-7821',
        status: 'Validated',
        lastUpdated: '2024-05-11T12:30:00Z',
        patientName: 'Sarah Connor',
        mrn: 'MRN-88291',
        region: 'US-EAST',
        organizationId: 'org_A',
        validationScore: 100,
        validationIssues: [],
        relationships: [
            { type: 'Practitioner', targetId: 'pr-9921', targetType: 'Practitioner' }
        ],
        auditLogs: [
            { id: 'log-1', timestamp: '2024-05-11T12:30:00Z', action: 'VALIDATE', actor: 'System Validator', status: 'SUCCESS' },
            { id: 'log-0', timestamp: '2024-05-11T12:28:00Z', action: 'CREATE', actor: 'Epic Gateway', status: 'SUCCESS' }
        ],
        metadata: {
            gender: 'female',
            birthDate: '1985-04-12',
        },
        json: JSON.stringify({
            resourceType: 'Patient',
            id: 'pt-7821',
            active: true,
            name: [{ family: 'Connor', given: ['Sarah'] }],
            gender: 'female',
            birthDate: '1985-04-12',
            telecom: [{ system: 'phone', value: '555-0199' }],
            address: [{ line: ['123 Tech Lane'], city: 'Austin', state: 'TX', postalCode: '73301' }]
        }, null, 2)
    },
    {
        resourceType: 'Observation',
        id: 'obs-9902',
        status: 'Processed',
        lastUpdated: '2024-05-11T14:15:00Z',
        patientId: 'pt-7821',
        patientName: 'Sarah Connor',
        region: 'US-EAST',
        organizationId: 'org_A',
        validationScore: 95,
        validationIssues: [
            { severity: 'info', code: 'deprecated-code', details: 'LOINC code 123-4 is deprecated, use 567-8 instead.' }
        ],
        relationships: [
            { type: 'Subject', targetId: 'pt-7821', targetType: 'Patient' },
            { type: 'Encounter', targetId: 'enc-4412', targetType: 'Encounter' }
        ],
        auditLogs: [
            { id: 'log-2', timestamp: '2024-05-11T14:15:00Z', action: 'SYNC', actor: 'FHIR Bridge', status: 'SUCCESS' }
        ],
        metadata: {
            code: 'Blood Pressure',
            value: '120/80 mmHg',
        },
        json: JSON.stringify({
            resourceType: 'Observation',
            id: 'obs-9902',
            status: 'final',
            category: [{ coding: [{ system: 'vital-signs', code: 'vital-signs' }] }],
            code: { text: 'Blood Pressure' },
            subject: { reference: 'Patient/pt-7821' },
            encounter: { reference: 'Encounter/enc-4412' },
            effectiveDateTime: '2024-05-11T14:10:00Z',
            valueQuantity: { value: 120, unit: 'mmHg' }
        }, null, 2)
    },
    {
        resourceType: 'DiagnosticReport',
        id: 'diag-1123',
        status: 'Failed',
        lastUpdated: '2024-05-11T16:20:00Z',
        patientId: 'pt-7821',
        patientName: 'Sarah Connor',
        region: 'US-WEST',
        organizationId: 'org_B',
        validationScore: 40,
        validationIssues: [
            { severity: 'error', code: 'missing-field', details: 'Required field "conclusion" is missing.', location: 'root.conclusion' },
            { severity: 'warning', code: 'invalid-format', details: 'Category code should be an array.' }
        ],
        relationships: [
            { type: 'Subject', targetId: 'pt-7821', targetType: 'Patient' }
        ],
        auditLogs: [
            { id: 'log-3', timestamp: '2024-05-11T16:20:00Z', action: 'VALIDATE', actor: 'System Validator', status: 'FAILURE' }
        ],
        metadata: {
            test: 'Chest X-Ray',
        },
        json: JSON.stringify({
            resourceType: 'DiagnosticReport',
            id: 'diag-1123',
            status: 'partial',
            category: { text: 'Radiology' },
            subject: { reference: 'Patient/pt-7821' },
            issued: '2024-05-11T16:15:00Z'
        }, null, 2)
    }
];

export const mockClinicalTimeline: ClinicalEvent[] = [
    { id: 't1', date: '2024-05-11 14:15', type: 'Observation', description: 'BP: 120/80 mmHg', status: 'Final', severity: 'low' },
    { id: 't2', date: '2024-05-11 12:30', type: 'Patient', description: 'Record Updated', status: 'Active' },
    { id: 't3', date: '2024-05-10 09:00', type: 'Encounter', description: 'Emergency Visit', status: 'Finished', provider: 'Dr. Silberman', severity: 'medium' },
    { id: 't4', date: '2024-05-09 15:20', type: 'Procedure', description: 'CT Scan - Thorax', status: 'Completed', severity: 'high' }
];

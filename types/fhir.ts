export type FhirResourceStatus =
    | 'Validated'
    | 'Processed'
    | 'Queued'
    | 'Failed'
    | 'Partial';

export type FhirResourceType =
    | 'Patient'
    | 'Observation'
    | 'Encounter'
    | 'Condition'
    | 'Procedure'
    | 'MedicationRequest'
    | 'DiagnosticReport';

export type FhirRegion = 'US-EAST' | 'US-WEST' | 'EU-CENTRAL' | 'AP-SOUTH';

export interface FhirValidationIssue {
    severity: 'error' | 'warning' | 'info';
    code: string;
    details: string;
    location?: string;
}

export interface FhirAuditLog {
    id: string;
    timestamp: string;
    action: 'CREATE' | 'UPDATE' | 'VALIDATE' | 'SYNC';
    actor: string;
    status: 'SUCCESS' | 'FAILURE';
}

export interface FhirResource {
    resourceType: FhirResourceType;
    id: string;
    status: FhirResourceStatus;
    lastUpdated: string;
    patientId?: string;
    patientName?: string;
    mrn?: string;
    region: FhirRegion;
    organizationId?: string;
    validationScore: number; // 0-100
    validationIssues: FhirValidationIssue[];
    relationships: { type: string; targetId: string; targetType: string }[];
    auditLogs: FhirAuditLog[];
    metadata: Record<string, any>;
    json: string;
}

export interface ClinicalEvent {
    id: string;
    date: string;
    type: string;
    description: string;
    status: string;
    provider?: string;
    severity?: 'low' | 'medium' | 'high';
}
export type IntegrationStatus =
    | 'Connected'
    | 'Pending';

export interface Integration {
    name: string;
    type: string;
    status: IntegrationStatus;
    requests: string;
}
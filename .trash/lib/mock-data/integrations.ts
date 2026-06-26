import { Integration } from '@/types/integration';

export const integrations: Integration[] = [
    {
        name: 'Epic EHR',
        type: 'HL7 Feed',
        status: 'Connected',
        requests: '1.2M',
    },
    {
        name: 'Cerner',
        type: 'FHIR API',
        status: 'Connected',
        requests: '842K',
    },
    {
        name: 'LabCorp',
        type: 'Laboratory',
        status: 'Pending',
        requests: '214K',
    },
];
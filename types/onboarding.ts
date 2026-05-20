export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export type OrganizationType = 
  | 'Hospital Network'
  | 'Clinic'
  | 'Diagnostic Center'
  | 'Insurance Provider'
  | 'Telehealth Platform'
  | 'Healthcare SaaS'
  | 'Research Institution';

export type HospitalSize =
  | 'Small (<100 beds)'
  | 'Medium (100–500 beds)'
  | 'Large (500–2000 beds)'
  | 'Enterprise (2000+ beds)';

export type FhirVersion = 'FHIR R4' | 'FHIR R4B' | 'FHIR R5' | 'FHIR DSTU2';

export interface InfrastructureModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  status?: 'ready' | 'provisioning' | 'queued';
}

export type TeamRole = 'admin' | 'operator' | 'developer' | 'auditor';

export interface TeamMember {
  email: string;
  role: TeamRole;
}

export interface OnboardingState {
  organization: {
    name: string;
    type: OrganizationType;
    slug: string;
    timezone: string;
    region: string;
    hospitalSize: HospitalSize;
  };
  infrastructure: InfrastructureModule[];
  infraPreferences: {
    hl7Support: boolean;
    fhirVersion: FhirVersion;
    cloudRegion: string;
    realtimeStreaming: boolean;
  };
  compliance: {
    mfa: boolean;
    auditLogging: boolean;
    hipaaControls: boolean;
    encryption: boolean;
    sessionTimeout: boolean;
    deviceTrust: boolean;
  };
  team: TeamMember[];
}

export interface AccountDetails {
  fullName: string;
  workEmail: string;
}

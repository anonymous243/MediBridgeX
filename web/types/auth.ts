export type UserRole = 'admin' | 'operator' | 'developer' | 'auditor' | 'super_admin';

export type Permission = 
  | 'manage:users'
  | 'view:analytics'
  | 'manage:api_keys'
  | 'retry:messages'
  | 'view:audit_logs'
  | 'access:developer_tools'
  | 'view:observability'
  | 'manage:settings'
  | 'manage:organizations' // for super_admin
  | 'manage:webhooks'
  | 'view:messages'
  | 'view:fhir';

export interface Organization {
  id: string;
  name: string;
  slug?: string;
}

export interface WorkspaceMetadata {
  slug: string;
  region: string;
  organizationType: string;
  hospitalSize?: string;
  fhirVersion?: string;
  provisionedAt?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  permissions: Permission[];
  // Onboarding & Workspace
  onboardingCompleted: boolean;
  workspaceSlug?: string;
  workspace?: WorkspaceMetadata;
}

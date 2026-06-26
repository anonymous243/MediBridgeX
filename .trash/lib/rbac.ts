import { SessionUser, Permission, UserRole } from '@/types/auth';

export const hasPermission = (user: SessionUser | null, permission: Permission): boolean => {
  if (!user) return false;
  // Super admin has all permissions implicitly or explicitly
  if (user.role === 'super_admin') return true;
  return user.permissions.includes(permission);
};

export const hasRole = (user: SessionUser | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const canManageUsers = (user: SessionUser | null) => hasPermission(user, 'manage:users');
export const canViewAnalytics = (user: SessionUser | null) => hasPermission(user, 'view:analytics');
export const canManageApiKeys = (user: SessionUser | null) => hasPermission(user, 'manage:api_keys');
export const canRetryMessages = (user: SessionUser | null) => hasPermission(user, 'retry:messages');
export const canViewAuditLogs = (user: SessionUser | null) => hasPermission(user, 'view:audit_logs');
export const canAccessDeveloperTools = (user: SessionUser | null) => hasPermission(user, 'access:developer_tools');

'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { hasRole, hasPermission } from '@/lib/rbac';
import { UserRole, Permission } from '@/types/auth';
import { PermissionDenied } from '@/components/states/PermissionDenied';
import { SessionExpired } from '@/components/states/SessionExpired';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  fallbackMessage?: string;
}

export function ProtectedRoute({ children, requiredRoles, requiredPermissions, fallbackMessage }: ProtectedRouteProps) {
  const { user, isSessionExpired } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  if (isSessionExpired) {
    return <SessionExpired />;
  }

  if (!user) {
    return <PermissionDenied message="You must be logged in to view this module." />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const roleMatched = hasRole(user, requiredRoles);
    if (!roleMatched) {
      return <PermissionDenied message={fallbackMessage || "Your assigned role does not have access to this module."} />;
    }
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const permissionMatched = requiredPermissions.every(permission => hasPermission(user, permission));
    if (!permissionMatched) {
      return <PermissionDenied message={fallbackMessage || "You lack the specific permissions required for this module."} />;
    }
  }

  return <>{children}</>;
}

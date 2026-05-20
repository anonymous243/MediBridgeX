'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { hasRole, hasPermission } from '@/lib/rbac';
import { UserRole, Permission } from '@/types/auth';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  fallback?: React.ReactNode;
}

export function PermissionGuard({ children, requiredRoles, requiredPermissions, fallback = null }: PermissionGuardProps) {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return null;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const roleMatched = hasRole(user, requiredRoles);
    if (!roleMatched) {
      return <>{fallback}</>;
    }
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const permissionMatched = requiredPermissions.every(permission => hasPermission(user, permission));
    if (!permissionMatched) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

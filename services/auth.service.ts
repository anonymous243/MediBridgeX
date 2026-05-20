import { SessionUser, Permission, UserRole } from '@/types/auth';

// ============================================================
// MediBridgeX — Auth Service
// All calls route through Next.js BFF API handlers (/api/auth/*)
// which set/clear httpOnly cookies server-side. No token ever
// touches localStorage or client-side JS.
// ============================================================

export interface AuthResponse {
  user: SessionUser;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  [key: string]: unknown;
}

// These are kept for reference/type inference in components
export const MOCK_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['manage:users', 'view:analytics', 'manage:settings', 'view:observability', 'view:messages', 'view:fhir'],
  operator: ['view:messages', 'retry:messages', 'view:observability'],
  developer: ['manage:api_keys', 'manage:webhooks', 'access:developer_tools', 'view:fhir', 'view:observability'],
  auditor: ['view:audit_logs', 'view:analytics', 'view:observability'],
  super_admin: ['manage:organizations', 'manage:users', 'view:analytics', 'manage:api_keys', 'retry:messages', 'view:audit_logs', 'access:developer_tools', 'view:observability', 'manage:settings', 'manage:webhooks', 'view:messages', 'view:fhir'],
};

export class AuthService {
  /**
   * Login — calls the BFF login route which handles mock/real mode,
   * proxies to FastAPI if needed, and sets the token as an httpOnly cookie.
   * Returns the user object only (token is never sent to client).
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      credentials: 'same-origin', // ensure cookies are included
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || 'Login failed.');
    }

    return response.json();
  }

  /**
   * Logout — calls the BFF logout route which clears the httpOnly cookie
   * and optionally invalidates the token on the FastAPI backend.
   */
  static async logout(): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
  }

  /**
   * Get current session user — reads from the httpOnly cookie server-side
   * via the BFF /me route. Called on page load to restore session state.
   */
  static async getMe(): Promise<SessionUser> {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error('Session expired or not found.');
    }

    return response.json();
  }
}

export default AuthService;

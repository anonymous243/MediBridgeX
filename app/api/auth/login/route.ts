import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// MediBridgeX — Auth: Login Route Handler
// Sets auth token as httpOnly cookie — token never touches client JS.
// Supports mock mode and real FastAPI mode transparently.
// ============================================================

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_API === 'true';
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const AUTH_COOKIE_NAME = 'mbx_auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

type UserRole = 'admin' | 'operator' | 'developer' | 'auditor' | 'super_admin';

const MOCK_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['manage:users', 'view:analytics', 'manage:settings', 'view:observability', 'view:messages', 'view:fhir'],
  operator: ['view:messages', 'retry:messages', 'view:observability'],
  developer: ['manage:api_keys', 'manage:webhooks', 'access:developer_tools', 'view:fhir', 'view:observability'],
  auditor: ['view:audit_logs', 'view:analytics', 'view:observability'],
  super_admin: ['manage:organizations', 'manage:users', 'view:analytics', 'manage:api_keys', 'retry:messages', 'view:audit_logs', 'access:developer_tools', 'view:observability', 'manage:settings', 'manage:webhooks', 'view:messages', 'view:fhir'],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: { message: 'Email is required.' } }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: { message: 'Password is required.' } }, { status: 400 });
    }

    // ── Mock Mode ───────────────────────────────────────────
    if (IS_MOCK) {
      await new Promise(r => setTimeout(r, 800)); // simulate network delay

      let role: UserRole = 'admin';
      let orgId = 'org_A';
      let orgName = 'Hospital A';

      if (email.includes('operator')) { role = 'operator'; }
      if (email.includes('developer')) { role = 'developer'; orgId = 'org_B'; orgName = 'Hospital B'; }
      if (email.includes('auditor')) { role = 'auditor'; orgId = 'org_B'; orgName = 'Hospital B'; }
      if (email.includes('super')) { role = 'super_admin'; orgId = 'PLATFORM'; orgName = 'MediBridgeX Platform'; }

      const mockToken = `mock_jwt_${Buffer.from(email).toString('base64')}`;

      const user = {
        id: 'u_123',
        email,
        name: 'Clinical User',
        role,
        organizationId: orgId,
        organizationName: orgName,
        permissions: MOCK_PERMISSIONS[role],
        onboardingCompleted: true,
        workspaceSlug: orgId.toLowerCase().replace('_', '-'),
        workspace: {
          slug: orgId.toLowerCase().replace('_', '-'),
          region: 'US East (N. Virginia)',
          organizationType: 'Hospital Network',
          hospitalSize: 'Large (500–2000 beds)',
          fhirVersion: 'FHIR R4',
          provisionedAt: new Date().toISOString(),
        },
      };

      const response = NextResponse.json({ user }, { status: 200 });
      response.cookies.set(AUTH_COOKIE_NAME, mockToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      });
      return response;
    }

    // ── Real FastAPI Mode ────────────────────────────────────
    const fastapiResponse = await fetch(`${FASTAPI_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!fastapiResponse.ok) {
      const errorData = await fastapiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: { message: errorData?.detail || 'Login failed.' } },
        { status: fastapiResponse.status }
      );
    }

    const data = await fastapiResponse.json();
    const { user, token } = data;

    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return response;

  } catch {
    return NextResponse.json({ error: { message: 'Internal server error.' } }, { status: 500 });
  }
}

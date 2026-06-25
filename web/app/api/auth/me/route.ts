export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// MediBridgeX — Auth: /me Route Handler
// Reads httpOnly cookie server-side. Returns user session data.
// Client never sees or touches the raw token.
// ============================================================

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_API === 'true';
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const AUTH_COOKIE_NAME = 'mbx_auth_token';

const MOCK_PERMISSIONS = ['manage:users', 'view:analytics', 'manage:settings', 'view:observability', 'view:messages', 'view:fhir'];

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: { message: 'Not authenticated.' } }, { status: 401 });
    }

    // ── Mock Mode ───────────────────────────────────────────
    if (IS_MOCK) {
      // Decode mock token to retrieve email
      let email = 'admin@medibridgex.io';
      try {
        const encoded = token.replace('mock_jwt_', '');
        email = Buffer.from(encoded, 'base64').toString('utf-8');
      } catch { /* use default email */ }

      return NextResponse.json({
        id: 'u_123',
        email,
        name: 'Clinical User',
        role: 'admin',
        organizationId: 'org_123',
        organizationName: 'Acme General Hospital',
        permissions: MOCK_PERMISSIONS,
        onboardingCompleted: true,
        workspaceSlug: 'org-123',
        workspace: {
          slug: 'org-123',
          region: 'US East (N. Virginia)',
          organizationType: 'Hospital Network',
          hospitalSize: 'Large (500–2000 beds)',
          fhirVersion: 'FHIR R4',
          provisionedAt: new Date().toISOString(),
        },
      }, { status: 200 });
    }

    // ── Real FastAPI Mode ────────────────────────────────────
    const fastapiResponse = await fetch(`${FASTAPI_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!fastapiResponse.ok) {
      return NextResponse.json({ error: { message: 'Session expired or invalid.' } }, { status: 401 });
    }

    const user = await fastapiResponse.json();
    return NextResponse.json(user, { status: 200 });

  } catch {
    return NextResponse.json({ error: { message: 'Internal server error.' } }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// MediBridgeX — Auth: Logout Route Handler
// Clears httpOnly auth cookie and optionally invalidates FastAPI token.
// ============================================================

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_API === 'true';
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const AUTH_COOKIE_NAME = 'mbx_auth_token';

export async function POST(req: NextRequest) {
  try {
    // ── Real mode: Invalidate token server-side ──────────────
    if (!IS_MOCK) {
      const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (token) {
        try {
          await fetch(`${FASTAPI_URL}/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // Non-critical: proceed with cookie clearance even if FastAPI call fails
        }
      }
    }

    // ── Clear the auth cookie (same-origin, httpOnly, secure) ─
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(AUTH_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    });
    return response;

  } catch {
    return NextResponse.json({ error: { message: 'Internal server error.' } }, { status: 500 });
  }
}

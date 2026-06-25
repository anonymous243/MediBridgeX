export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_API === 'true';
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const AUTH_COOKIE_NAME = 'mbx_auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp_code } = body;

    if (!email || !otp_code) {
      return NextResponse.json({ error: { message: 'Email and OTP code are required.' } }, { status: 400 });
    }

    // ── Mock Mode ───────────────────────────────────────────
    if (IS_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      if (otp_code !== '123456') {
        return NextResponse.json({ error: { message: 'Invalid or expired OTP code.' } }, { status: 400 });
      }

      const mockToken = `mock_jwt_${Buffer.from(email).toString('base64')}`;
      const user = {
        id: 'u_' + Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0].toUpperCase(),
        role: 'admin',
        onboardingCompleted: false, // New signup needs onboarding
        permissions: [
          'manage:users', 'view:analytics', 'manage:settings', 'view:observability',
          'view:messages', 'view:fhir', 'manage:api_keys', 'manage:webhooks', 'view:audit_logs'
        ],
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
    const fastapiResponse = await fetch(`${FASTAPI_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp_code }),
    });

    if (!fastapiResponse.ok) {
      const errorData = await fastapiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: { message: errorData?.detail || 'Invalid or expired OTP code.' } },
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

  } catch (err) {
    return NextResponse.json({ error: { message: 'Internal server error during verification.' } }, { status: 500 });
  }
}

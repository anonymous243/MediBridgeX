export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_API === 'true';
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: { message: 'Email is required.' } }, { status: 400 });
    }

    // ── Mock Mode ───────────────────────────────────────────
    if (IS_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      return NextResponse.json({ message: 'Mock OTP code resent. Code is 123456.' }, { status: 200 });
    }

    // ── Real FastAPI Mode ────────────────────────────────────
    const fastapiResponse = await fetch(`${FASTAPI_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!fastapiResponse.ok) {
      const errorData = await fastapiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: { message: errorData?.detail || 'Failed to resend OTP.' } },
        { status: fastapiResponse.status }
      );
    }

    const data = await fastapiResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: { message: 'Internal server error during OTP resend.' } }, { status: 500 });
  }
}

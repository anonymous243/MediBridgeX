export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_API === 'true';
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: { message: 'Missing signup details.' } }, { status: 400 });
    }

    // ── Mock Mode ───────────────────────────────────────────
    if (IS_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      return NextResponse.json({ message: 'Mock Signup successful. Mock OTP code is 123456.' }, { status: 200 });
    }

    // ── Real FastAPI Mode ────────────────────────────────────
    const fastapiResponse = await fetch(`${FASTAPI_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!fastapiResponse.ok) {
      const errorData = await fastapiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: { message: errorData?.detail || 'Signup failed.' } },
        { status: fastapiResponse.status }
      );
    }

    const data = await fastapiResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: { message: 'Internal server error during signup.' } }, { status: 500 });
  }
}

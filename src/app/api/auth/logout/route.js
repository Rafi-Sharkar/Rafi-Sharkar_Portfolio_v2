// POST /api/auth/logout — clear the admin_session cookie.
import { NextResponse } from 'next/server';
import { buildClearCookie } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ authenticated: false });
  res.headers.set('Set-Cookie', buildClearCookie());
  return res;
}

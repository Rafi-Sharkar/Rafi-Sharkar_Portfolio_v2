// GET /api/auth/me — check whether the request has a valid admin_session cookie
// and report bootstrap state so the login form can show a "default credentials"
// hint on first run.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSeed } from '@/lib/seed-runtime';
import { verifySession, readSessionFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Make sure the default admin exists. Tracks whether we just created one
    // so the UI can surface the hint.
    const seedResult = await ensureSeed();

    const token = readSessionFromRequest(request);
    const payload = await verifySession(token);

    if (!payload) {
      return NextResponse.json({
        authenticated: false,
        bootstrapAvailable: !!seedResult.bootstrapAvailable,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.uid },
      select: { id: true, username: true },
    });

    if (!user) {
      const res = NextResponse.json({ authenticated: false });
      res.headers.set('Set-Cookie', 'admin_session=; Path=/; Max-Age=0');
      return res;
    }

    return NextResponse.json({
      authenticated: true,
      user,
      bootstrapAvailable: !!seedResult.bootstrapAvailable,
    });
  } catch (err) {
    console.error('[api/auth/me] error:', err);
    return NextResponse.json({ authenticated: false });
  }
}

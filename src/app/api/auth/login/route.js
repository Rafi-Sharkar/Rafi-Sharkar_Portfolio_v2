// POST /api/auth/login — verify username/password against Prisma and set the
// admin_session cookie. Calls ensureSeed() first so the default admin exists on
// first ever login attempt (handy when DATABASE_URL is empty until late).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSeed } from '@/lib/seed-runtime';
import {
  verifyPassword,
  signSession,
  buildSessionCookie,
} from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await ensureSeed();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const username = (body?.username || '').toString().trim();
    const password = (body?.password || '').toString();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await signSession({
      uid: user.id,
      username: user.username,
    });

    const res = NextResponse.json({
      authenticated: true,
      user: { id: user.id, username: user.username },
    });
    res.headers.set('Set-Cookie', buildSessionCookie(token));
    return res;
  } catch (err) {
    console.error('[api/auth/login] error:', err);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

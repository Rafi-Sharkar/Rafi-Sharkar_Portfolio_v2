// /api/skills — list + create.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSeed } from '@/lib/seed-runtime';
import { verifySession, readSessionFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeed();
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json(skills);
  } catch (err) {
    console.error('[api/skills GET] error:', err);
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = readSessionFromRequest(request);
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!body?.name || !body?.category) {
      return NextResponse.json(
        { error: 'name and category are required' },
        { status: 400 }
      );
    }

    const created = await prisma.skill.create({
      data: {
        name: String(body.name).slice(0, 64),
        level: body.level ? String(body.level).slice(0, 64) : 'Intermediate',
        category: String(body.category).slice(0, 32),
        order: Number.isFinite(body.order) ? body.order : 0,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('[api/skills POST] error:', err);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

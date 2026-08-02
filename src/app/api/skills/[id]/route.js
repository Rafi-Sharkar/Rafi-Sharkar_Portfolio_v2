// /api/skills/[id] — update + delete.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession, readSessionFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireAdmin(request) {
  const token = readSessionFromRequest(request);
  return verifySession(token);
}

export async function PUT(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const data = {};
    if (body.name !== undefined) data.name = String(body.name).slice(0, 64);
    if (body.level !== undefined) data.level = String(body.level).slice(0, 64);
    if (body.category !== undefined) data.category = String(body.category).slice(0, 32);
    if (body.order !== undefined && Number.isFinite(body.order)) data.order = body.order;

    const updated = await prisma.skill.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('[api/skills/[id] PUT] error:', err);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('[api/skills/[id] DELETE] error:', err);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}

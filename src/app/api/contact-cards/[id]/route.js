// /api/contact-cards/[id] — update + delete.
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
    if (body.type !== undefined) data.type = String(body.type).slice(0, 16);
    if (body.label !== undefined) data.label = String(body.label).slice(0, 64);
    if (body.value !== undefined) data.value = String(body.value).slice(0, 255);
    if (body.href !== undefined) data.href = body.href ? String(body.href).slice(0, 512) : null;
    if (body.color !== undefined) data.color = String(body.color).slice(0, 32);
    if (body.order !== undefined && Number.isFinite(body.order)) data.order = body.order;

    const updated = await prisma.contactCard.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('[api/contact-cards/[id] PUT] error:', err);
    return NextResponse.json({ error: 'Failed to update contact card' }, { status: 500 });
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

    await prisma.contactCard.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('[api/contact-cards/[id] DELETE] error:', err);
    return NextResponse.json({ error: 'Failed to delete contact card' }, { status: 500 });
  }
}

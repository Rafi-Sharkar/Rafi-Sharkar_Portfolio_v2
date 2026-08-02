// /api/contact-cards — list + create.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSeed } from '@/lib/seed-runtime';
import { verifySession, readSessionFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeed();
    const cards = await prisma.contactCard.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json(cards);
  } catch (err) {
    console.error('[api/contact-cards GET] error:', err);
    return NextResponse.json({ error: 'Failed to load contact cards' }, { status: 500 });
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

    if (!body?.type || !body?.label || !body?.value) {
      return NextResponse.json(
        { error: 'type, label, and value are required' },
        { status: 400 }
      );
    }

    const created = await prisma.contactCard.create({
      data: {
        type: String(body.type).slice(0, 16),
        label: String(body.label).slice(0, 64),
        value: String(body.value).slice(0, 255),
        href: body.href ? String(body.href).slice(0, 512) : null,
        color: body.color ? String(body.color).slice(0, 32) : 'from-blue-400 to-indigo-600',
        order: Number.isFinite(body.order) ? body.order : 0,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('[api/contact-cards POST] error:', err);
    return NextResponse.json({ error: 'Failed to create contact card' }, { status: 500 });
  }
}

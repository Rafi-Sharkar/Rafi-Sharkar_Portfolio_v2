import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parseId(raw) {
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

// DELETE /api/contacts/[id] - delete a contact message
export async function DELETE(_request, { params }) {
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing or invalid contact id' }, { status: 400 });
  }

  try {
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error('deleteContact error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/contacts - list contact messages (admin)
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('getContacts error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/contacts - public contact submission
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing name, email, or message' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: { name, email, message },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('addContact error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
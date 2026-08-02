import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/certificates - list certificates
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error('getCertificates error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/certificates - create a certificate
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, issuer, date, credential_url } = body;

    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 });
    }

    const cert = await prisma.certificate.create({
      data: {
        title,
        issuer: issuer ?? null,
        date: date ? new Date(date) : null,
        credential_url: credential_url ?? null,
      },
    });

    return NextResponse.json(cert, { status: 201 });
  } catch (error) {
    console.error('addCertificate error', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
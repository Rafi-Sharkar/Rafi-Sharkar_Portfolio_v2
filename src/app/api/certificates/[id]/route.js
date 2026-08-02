import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parseId(raw) {
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

// PUT /api/certificates/[id] - update a certificate
export async function PUT(request, { params }) {
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing or invalid certificate id' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { title, issuer, date, credential_url } = body;

    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        issuer: issuer ?? existing.issuer,
        date: date ? new Date(date) : existing.date,
        credential_url: credential_url ?? existing.credential_url,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('updateCertificate error', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/certificates/[id] - delete a certificate
export async function DELETE(_request, { params }) {
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing or invalid certificate id' }, { status: 400 });
  }

  try {
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error('deleteCertificate error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
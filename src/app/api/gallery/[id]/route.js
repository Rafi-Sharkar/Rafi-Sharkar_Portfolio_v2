import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parseId(raw) {
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

// PUT /api/gallery/[id] - update a gallery item
export async function PUT(request, { params }) {
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing or invalid gallery id' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { image_url, caption, title, story } = body;

    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        image_url: image_url ?? existing.image_url,
        title: title ?? existing.title,
        caption: caption ?? existing.caption,
        story: story ?? existing.story,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('updateGallery error', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - delete a gallery item
export async function DELETE(_request, { params }) {
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing or invalid gallery id' }, { status: 400 });
  }

  try {
    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error('deleteGallery error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
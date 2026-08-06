import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/gallery - list gallery items
export async function GET() {
  try {
    const gallery = await prisma.galleryItem.findMany({
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('getGallery error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/gallery - create a gallery item
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { image_url, caption, title, story } = body;

    if (!image_url) {
      return NextResponse.json({ error: 'Missing image_url' }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        image_url,
        title: title ?? null,
        caption: caption ?? null,
        story: story ?? null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('addGallery error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parseId(raw) {
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

// PUT /api/projects/[id] - update a project
export async function PUT(request, { params }) {
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing or invalid project id' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { title, description, github_link, live_link, image_url } = body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        github_link: github_link ?? existing.github_link,
        live_link: live_link ?? existing.live_link,
        image_url: image_url ?? existing.image_url,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('updateProject error', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - delete a project
export async function DELETE(_request, { params }) {
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing or invalid project id' }, { status: 400 });
  }

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error('deleteProject error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
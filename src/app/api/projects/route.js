import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects - list all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('getProjects error', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - create a new project
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, description, github_link, live_link } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing title or description' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        github_link: github_link ?? null,
        live_link: live_link ?? null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('addProject error', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
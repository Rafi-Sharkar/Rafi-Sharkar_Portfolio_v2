// /api/profile — singleton profile row.
// GET: public, returns the single Profile (auto-creates a default if none exists).
// PUT: admin-only, upserts the Profile row.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSeed, DEFAULT_PROFILE } from '@/lib/seed-runtime';
import { verifySession, readSessionFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_FIELDS = [
  'name',
  'jobTitle',
  'bio',
  'profilePic',
  'coverPic',
  'cvUrl',
  'githubUrl',
  'linkedinUrl',
  'facebookUrl',
  'instagramUrl',
  'aboutP1',
  'aboutP2',
  'quote',
  'heroSubtitle',
  'heroHeading',
  'heroTagline',
  'contactTitle',
  'contactSubtitle',
  'mapLabel',
  'experienceStartDate',
];

export async function GET() {
  try {
    await ensureSeed();
    let profile = await prisma.profile.findFirst({ orderBy: { id: 'asc' } });
    if (!profile) {
      profile = await prisma.profile.create({ data: DEFAULT_PROFILE });
    }
    return NextResponse.json(profile);
  } catch (err) {
    console.error('[api/profile GET] error:', err);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function PUT(request) {
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

    const data = {};
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) {
        if (key === 'experienceStartDate' && body[key]) {
          data[key] = new Date(body[key]);
        } else {
          data[key] = body[key];
        }
      }
    }

    // Upsert into a single row — find the first one or create it.
    const existing = await prisma.profile.findFirst({ orderBy: { id: 'asc' } });
    let result;
    if (existing) {
      result = await prisma.profile.update({
        where: { id: existing.id },
        data,
      });
    } else {
      // Always start with the defaults so any field the admin didn't send
      // still has a value (avoids NOT NULL violations).
      result = await prisma.profile.create({
        data: { ...DEFAULT_PROFILE, ...data },
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[api/profile PUT] error:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

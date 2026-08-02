// Runtime bootstrap — ensures the default admin user (and a default Profile row)
// exists the first time anyone hits the auth API. Idempotent: safe to call on every
// request. Pairs with prisma/seed.js so the same defaults are available whether
// you run `npm run prisma:seed` or just start the app and click login.
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './auth.js';

const prisma = globalThis.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;

// Default credentials requested by the project owner.
export const DEFAULT_ADMIN = {
  username: 'rafi_sharkar',
  password: 'Rafi#144',
};

// Default profile content — used when /api/profile is called before the admin
// has saved any customizations. Mirrors the historical hardcoded "About" page.
export const DEFAULT_PROFILE = {
  name: 'Mustakim Billah Rafi',
  jobTitle: 'Full-Stack Developer',
  bio: 'Passionate developer building modern web applications.',
  profilePic: '/photos/profile.jpg',
  coverPic: '/photos/cover.jpg',
  cvUrl: '/documents/MUSTAKIM_BILLAH_RAFI.pdf',
  githubUrl: 'https://github.com/rafi-sharkar',
  linkedinUrl: 'https://www.linkedin.com/in/rafi-sharkar',
  facebookUrl: 'https://www.facebook.com/rafi.sharkar',
  instagramUrl: 'https://www.instagram.com/rafi_sharkar',
  aboutP1:
    "I'm a passionate developer who loves building modern web applications. I enjoy turning ideas into clean, performant, and user-friendly products.",
  aboutP2:
    'When I am not coding, I enjoy exploring new tech, contributing to side projects, and learning from the developer community.',
  quote: 'Clean code always looks like it was written by someone who cares.',
  heroSubtitle: 'Hello, Welcome',
  heroHeading: "I'm Mustakim Billah Rafi",
  heroTagline:
    'A passionate full-stack developer crafting clean, modern, and performant web experiences.',
  contactTitle: 'Get in touch',
  contactSubtitle: "Have a project in mind or just want to say hi? Let's talk.",
  mapLabel: 'Bangladesh',
  experienceStartDate: new Date('2020-01-01'),
};

export const DEFAULT_SKILLS = [
  // Languages
  { name: 'JavaScript', level: 'Advanced', category: 'languages', order: 0 },
  { name: 'TypeScript', level: 'Intermediate', category: 'languages', order: 1 },
  { name: 'Python', level: 'Intermediate', category: 'languages', order: 2 },
  // Frameworks
  { name: 'React', level: 'Advanced', category: 'frameworks', order: 0 },
  { name: 'Next.js', level: 'Advanced', category: 'frameworks', order: 1 },
  { name: 'Node.js', level: 'Advanced', category: 'frameworks', order: 2 },
  { name: 'Express', level: 'Intermediate', category: 'frameworks', order: 3 },
  // Databases
  { name: 'PostgreSQL', level: 'Advanced', category: 'databases', order: 0 },
  { name: 'MongoDB', level: 'Intermediate', category: 'databases', order: 1 },
  { name: 'Prisma', level: 'Advanced', category: 'databases', order: 2 },
  // Tools
  { name: 'Git', level: 'Advanced', category: 'tools', order: 0 },
  { name: 'Docker', level: 'Intermediate', category: 'tools', order: 1 },
  { name: 'Tailwind CSS', level: 'Advanced', category: 'tools', order: 2 },
  { name: 'Figma', level: 'Intermediate', category: 'tools', order: 3 },
];

export const DEFAULT_CONTACT_CARDS = [
  {
    type: 'phone',
    label: 'Phone',
    value: '+880 1XXX-XXXXXX',
    href: 'tel:+8801000000000',
    color: 'from-green-400 to-emerald-600',
    order: 0,
  },
  {
    type: 'email',
    label: 'Email',
    value: 'contact@rafisharkar.dev',
    href: 'mailto:contact@rafisharkar.dev',
    color: 'from-blue-400 to-indigo-600',
    order: 1,
  },
  {
    type: 'location',
    label: 'Location',
    value: 'Bangladesh',
    href: null,
    color: 'from-pink-400 to-rose-600',
    order: 2,
  },
];

// Best-effort bootstrap. Returns the bootstrap status so the login UI can
// show a "default credentials" hint when the user is being auto-created.
export async function ensureSeed() {
  const result = { bootstrapAvailable: false, createdAdmin: false, createdProfile: false };

  // 1. Ensure at least one admin user exists.
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    result.bootstrapAvailable = true;
    try {
      const passwordHash = await hashPassword(DEFAULT_ADMIN.password);
      await prisma.user.create({
        data: {
          username: DEFAULT_ADMIN.username,
          passwordHash,
        },
      });
      result.createdAdmin = true;
    } catch (err) {
      // Race condition: another concurrent request created the row first.
      // That's fine — log it and proceed.
      if (err?.code !== 'P2002') {
        console.error('[seed-runtime] failed to create default admin:', err);
      }
    }
  }

  // 2. Ensure a Profile row exists (so /api/profile has something to return).
  const profileCount = await prisma.profile.count();
  if (profileCount === 0) {
    try {
      await prisma.profile.create({ data: DEFAULT_PROFILE });
      result.createdProfile = true;
    } catch (err) {
      console.error('[seed-runtime] failed to create default profile:', err);
    }
  }

  // 3. Ensure the Skills list is populated (only on true first run).
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    try {
      await prisma.skill.createMany({ data: DEFAULT_SKILLS });
    } catch (err) {
      console.error('[seed-runtime] failed to create default skills:', err);
    }
  }

  // 4. Ensure ContactCards exist.
  const cardCount = await prisma.contactCard.count();
  if (cardCount === 0) {
    try {
      await prisma.contactCard.createMany({ data: DEFAULT_CONTACT_CARDS });
    } catch (err) {
      console.error('[seed-runtime] failed to create default contact cards:', err);
    }
  }

  return result;
}

export default prisma;

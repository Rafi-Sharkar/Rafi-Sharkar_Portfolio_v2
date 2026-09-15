// Runtime bootstrap — ensures the default admin user (and a default Profile row)
// exists the first time anyone hits the auth API. Idempotent: safe to call on every
// request. Pairs with prisma/seed.js so the same defaults are available whether
// you run `npm run prisma:seed` or just start the app and click login.
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './auth.js';

const prisma = globalThis.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;

// Default admin credentials are read from environment variables.
export const DEFAULT_ADMIN = {
  username: process.env.ADMIN_USERNAME || process.env.VITE_ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'change-me-set-ADMIN_PASSWORD',
};

// Default profile content — used when /api/profile is called before the admin
// has saved any customizations. Mirrors the historical hardcoded "About" page.
export const DEFAULT_PROFILE = {
  name: 'Mustakim Billah Rafi',
  jobTitle: 'System Design and Backend Engineer',
  bio: 'System Design & Backend Engineer specializing in scalable microservices, NestJS, Node.js, PostgreSQL, Redis, and AWS.',
  profilePic: '/photos/RS_002.jpg',
  coverPic: '/photos/RS_0022.jpg',
  cvUrl: '/documents/MUSTAKIM_BILLAH_RAFI.pdf',
  githubUrl: 'https://github.com/Rafi-Sharkar',
  linkedinUrl: 'https://www.linkedin.com/in/rafi-sharkar/',
  facebookUrl: 'https://www.facebook.com/rafi.sharkar.90/',
  instagramUrl: 'https://www.instagram.com/rafi_sharkar_0777/',
  aboutP1:
    'I am Mustakim Billah Rafi, a System Design and Backend Engineer with expertise in building scalable microservices, database schema design, and high-performance backend systems. I work with Node.js, NestJS, PostgreSQL, Redis, and AWS to architect multi-tenant production platforms with 99.9% uptime.',
  aboutP2:
    'Experienced in leading end-to-end architecture decisions, designing REST API endpoints secured with JWT/OAuth2 and RBAC, driving CI/CD containerization strategies, and building real-time event systems with WebSockets and BullMQ.',
  quote: 'Code with scalability, design with purpose, and build systems for peak resilience.',
  heroSubtitle: 'Hello, I am',
  heroHeading: 'Mustakim Billah Rafi',
  heroTagline:
    'Leading system design and microservices architecture for live production platforms. Specialized in Node.js, NestJS, PostgreSQL, Redis, Docker, and AWS cloud infrastructure.',
  contactTitle: "Let's work together",
  contactSubtitle: "Have a project in mind or just want to say hi? Let's talk.",
  mapLabel: 'Dhaka, Bangladesh',
  experienceStartDate: new Date('2022-09-01'),
};

export const DEFAULT_SKILLS = [
  // Languages
  { name: 'TypeScript', level: 'Experienced', category: 'languages', order: 0 },
  { name: 'JavaScript (ES6+)', level: 'Experienced', category: 'languages', order: 1 },
  { name: 'Python', level: 'Intermediate', category: 'languages', order: 2 },
  { name: 'SQL', level: 'Experienced', category: 'languages', order: 3 },
  { name: 'HTML5/CSS3', level: 'Experienced', category: 'languages', order: 4 },
  // Frameworks
  { name: 'Node.js', level: 'Experienced', category: 'frameworks', order: 0 },
  { name: 'NestJS', level: 'Experienced', category: 'frameworks', order: 1 },
  { name: 'Express.js', level: 'Experienced', category: 'frameworks', order: 2 },
  { name: 'React.js', level: 'Experienced', category: 'frameworks', order: 3 },
  { name: 'Next.js', level: 'Intermediate', category: 'frameworks', order: 4 },
  { name: 'WebSocket (Socket.io)', level: 'Experienced', category: 'frameworks', order: 5 },
  // Databases
  { name: 'PostgreSQL', level: 'Experienced', category: 'databases', order: 0 },
  { name: 'Redis (Caching)', level: 'Experienced', category: 'databases', order: 1 },
  { name: 'MongoDB', level: 'Intermediate', category: 'databases', order: 2 },
  // Tools
  { name: 'System Design & Microservices', level: 'Experienced', category: 'tools', order: 0 },
  { name: 'AWS & API Gateway', level: 'Experienced', category: 'tools', order: 1 },
  { name: 'Docker & Containerization', level: 'Experienced', category: 'tools', order: 2 },
  { name: 'GitHub Actions (CI/CD)', level: 'Experienced', category: 'tools', order: 3 },
  { name: 'BullMQ & Stripe API', level: 'Experienced', category: 'tools', order: 4 },
  { name: 'JWT, OAuth2 & RBAC', level: 'Experienced', category: 'tools', order: 5 },
  { name: 'Jest Testing', level: 'Experienced', category: 'tools', order: 6 },
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

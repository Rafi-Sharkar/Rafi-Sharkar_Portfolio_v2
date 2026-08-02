// Prisma seed script — run with `npm run prisma:seed`.
// Creates the default admin user plus a default Profile / Skills / ContactCards
// row so the app has something to show on first run. Idempotent: re-running it
// will not duplicate rows.
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
  username: 'rafi_sharkar',
  password: 'Rafi#144',
};

const DEFAULT_PROFILE = {
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

const DEFAULT_SKILLS = [
  { name: 'JavaScript', level: 'Advanced', category: 'languages', order: 0 },
  { name: 'TypeScript', level: 'Intermediate', category: 'languages', order: 1 },
  { name: 'Python', level: 'Intermediate', category: 'languages', order: 2 },
  { name: 'React', level: 'Advanced', category: 'frameworks', order: 0 },
  { name: 'Next.js', level: 'Advanced', category: 'frameworks', order: 1 },
  { name: 'Node.js', level: 'Advanced', category: 'frameworks', order: 2 },
  { name: 'Express', level: 'Intermediate', category: 'frameworks', order: 3 },
  { name: 'PostgreSQL', level: 'Advanced', category: 'databases', order: 0 },
  { name: 'MongoDB', level: 'Intermediate', category: 'databases', order: 1 },
  { name: 'Prisma', level: 'Advanced', category: 'databases', order: 2 },
  { name: 'Git', level: 'Advanced', category: 'tools', order: 0 },
  { name: 'Docker', level: 'Intermediate', category: 'tools', order: 1 },
  { name: 'Tailwind CSS', level: 'Advanced', category: 'tools', order: 2 },
  { name: 'Figma', level: 'Intermediate', category: 'tools', order: 3 },
];

const DEFAULT_CONTACT_CARDS = [
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

async function main() {
  // 1. Default admin user
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
  await prisma.user.upsert({
    where: { username: DEFAULT_ADMIN.username },
    update: {}, // never overwrite an existing password — admin can change it in the dashboard later
    create: {
      username: DEFAULT_ADMIN.username,
      passwordHash,
    },
  });
  console.log(`[seed] ensured admin user: ${DEFAULT_ADMIN.username}`);

  // 2. Default Profile (single row)
  const profileCount = await prisma.profile.count();
  if (profileCount === 0) {
    await prisma.profile.create({ data: DEFAULT_PROFILE });
    console.log('[seed] created default Profile row');
  } else {
    console.log('[seed] Profile already exists — skipping');
  }

  // 3. Skills
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({ data: DEFAULT_SKILLS });
    console.log(`[seed] created ${DEFAULT_SKILLS.length} default Skills`);
  } else {
    console.log('[seed] Skills already exist — skipping');
  }

  // 4. ContactCards
  const cardCount = await prisma.contactCard.count();
  if (cardCount === 0) {
    await prisma.contactCard.createMany({ data: DEFAULT_CONTACT_CARDS });
    console.log(`[seed] created ${DEFAULT_CONTACT_CARDS.length} default ContactCards`);
  } else {
    console.log('[seed] ContactCards already exist — skipping');
  }

  console.log('[seed] done.');
}

main()
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

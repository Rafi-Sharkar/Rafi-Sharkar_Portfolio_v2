'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Gallery_01, Cert, Projects1, Self, WorkExperiences } from '@/assets/data/data';

const PortfolioDataContext = createContext(null);

const withIds = (items, prefix) => {
  const baseTime = Date.now() - items.length * 1000;
  return items.map((item, index) => ({
    id: item.id || `${prefix}-${index + 1}`,
    createdAt: item.createdAt || baseTime + index * 1000,
    ...item,
  }));
};

const sortLatestFirst = (items) =>
  [...items].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

const projectImages = Projects1.map((project) => project.img);
const certificateImage = Cert[0]?.img || '';

const defaultSkills = {
  languages: [
    { name: 'TypeScript', level: 'Experienced' },
    { name: 'JavaScript (ES6+)', level: 'Experienced' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'SQL', level: 'Experienced' },
    { name: 'HTML5/CSS3', level: 'Experienced' },
  ],
  frameworks: [
    { name: 'Node.js', level: 'Experienced' },
    { name: 'NestJS', level: 'Experienced' },
    { name: 'Express.js', level: 'Experienced' },
    { name: 'React.js', level: 'Experienced' },
    { name: 'Next.js', level: 'Intermediate' },
    { name: 'WebSocket (Socket.io)', level: 'Experienced' },
  ],
  databases: [
    { name: 'PostgreSQL', level: 'Experienced' },
    { name: 'Redis (Caching)', level: 'Experienced' },
    { name: 'MongoDB', level: 'Intermediate' },
  ],
  tools: [
    { name: 'System Design & Microservices', level: 'Experienced' },
    { name: 'AWS & API Gateway', level: 'Experienced' },
    { name: 'Docker & Containerization', level: 'Experienced' },
    { name: 'GitHub Actions (CI/CD)', level: 'Experienced' },
    { name: 'BullMQ & Stripe API', level: 'Experienced' },
    { name: 'JWT, OAuth2 & RBAC', level: 'Experienced' },
    { name: 'Jest Testing', level: 'Experienced' },
  ],
};

const defaultProfile = {
  name: Self.name,
  jobTitle: Self.job_title,
  bio: '',
  profilePic: Self.profile_pic,
  coverPic: Self.cover_pic,
  cvUrl: Self.CV_down,
  githubUrl: Self.GH_link,
  linkedinUrl: Self.LI_link,
  facebookUrl: '',
  instagramUrl: '',
  aboutP1:
    'I am Mustakim Billah Rafi, a System Design and Backend Engineer with expertise in building scalable microservices, database schema design, and high-performance backend systems. I work with Node.js, NestJS, PostgreSQL, Redis, and AWS to architect multi-tenant production platforms with 99.9% uptime.',
  aboutP2:
    'Experienced in leading end-to-end architecture decisions, designing REST API endpoints secured with JWT/OAuth2 and RBAC, driving CI/CD containerization strategies, and building real-time event systems with WebSockets and BullMQ.',
  quote: 'Code with scalability, design with purpose, and build systems for peak resilience.',
  heroSubtitle: 'Hello, I am',
  heroHeading: '',
  heroTagline:
    'Leading system design and microservices architecture for live production platforms. Specialized in Node.js, NestJS, PostgreSQL, Redis, Docker, and AWS cloud infrastructure.',
  contactTitle: "Let's work together",
  contactSubtitle: '',
  mapLabel: 'Dhaka, Bangladesh',
  experienceStartDate: '2022-09-01',
};

const defaultContactCards = [
  {
    id: 'contact-phone',
    type: 'phone',
    label: 'Phone',
    value: '+8801905493909',
    href: 'tel:+8801905493909',
    color: 'accent-cyan',
  },
  {
    id: 'contact-email',
    type: 'email',
    label: 'Email',
    value: 'rafisharkar144@gmail.com',
    href: 'mailto:rafisharkar144@gmail.com',
    color: 'accent-purple',
  },
  {
    id: 'contact-location-1',
    type: 'location',
    label: 'Location',
    value: 'Bashundhara R/A, Dhaka',
    href: '',
    color: 'accent-pink',
  },
  {
    id: 'contact-location-2',
    type: 'location',
    label: 'Location 2',
    value: 'Chashara, Narayanganj',
    href: '',
    color: 'accent-emerald',
  },
];

const defaultData = {
  gallery: withIds(Gallery_01, 'gallery'),
  certificates: withIds(Cert, 'certificate'),
  projects: withIds(Projects1, 'project'),
  skills: defaultSkills,
  experiences: WorkExperiences,
  profile: defaultProfile,
  contact: {
    title: defaultContactCards.find((c) => c.type === 'email')?.value || 'Get in touch',
    mapLabel: defaultProfile.mapLabel,
    cards: defaultContactCards,
  },
};

const fetchJson = async (resource, init) => {
  const response = await fetch(`/api/${resource}`, init);
  if (!response.ok) {
    throw new Error(`Failed to load ${resource}`);
  }
  return response.json();
};

const fetchSafe = async (resource) => {
  try {
    return await fetchJson(resource);
  } catch (err) {
    console.warn(`[PortfolioData] ${resource} fetch failed:`, err);
    return null;
  }
};

const normalizeProjects = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return defaultData.projects;
  return withIds(
    rows.map((row, index) => ({
      id: String(row.id),
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now() - index * 1000,
      name: row.title || 'Untitled Project',
      // Prefer the row's own uploaded image; fall back to the static
      // placeholder so the public grid never shows a broken thumbnail.
      img: row.image_url || projectImages[index % projectImages.length] || projectImages[0] || '',
      scode: row.github_link || '',
      link: row.live_link || '',
      description: row.description || '',
    })),
    'project'
  );
};

const normalizeGallery = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return defaultData.gallery;
  return withIds(
    rows.map((row, index) => ({
      id: String(row.id),
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now() - index * 1000,
      img: row.image_url || '',
      caption: row.caption || '',
      title: row.title || '',
      story: row.story || '',
    })),
    'gallery'
  );
};

const normalizeCertificates = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return defaultData.certificates;
  return withIds(
    rows.map((row, index) => ({
      id: String(row.id),
      createdAt: row.date ? new Date(row.date).getTime() : Date.now() - index * 1000,
      // Prefer the row's uploaded image; fall back to the static placeholder.
      img: row.image_url || certificateImage,
      title: row.title || 'Professional Certificate',
      issuer: row.issuer || '',
      date: row.date || '',
      credential_url: row.credential_url || '',
      description: row.description || '',
    })),
    'certificate'
  );
};

const normalizeSkills = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return defaultData.skills;
  const grouped = { languages: [], frameworks: [], databases: [], tools: [] };
  rows.forEach((row) => {
    const category = row.category || 'tools';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ name: row.name, level: row.level || 'Intermediate' });
  });
  // Always return all four buckets so the UI doesn't blow up.
  return {
    languages: grouped.languages.length ? grouped.languages : defaultData.skills.languages,
    frameworks: grouped.frameworks.length ? grouped.frameworks : defaultData.skills.frameworks,
    databases: grouped.databases.length ? grouped.databases : defaultData.skills.databases,
    tools: grouped.tools.length ? grouped.tools : defaultData.skills.tools,
  };
};

const normalizeProfile = (row) => {
  if (!row) return defaultData.profile;
  return {
    ...defaultData.profile,
    ...row,
    // Keep experienceStartDate as an ISO string so SSR/CSR match.
    experienceStartDate:
      row.experienceStartDate
        ? new Date(row.experienceStartDate).toISOString().slice(0, 10)
        : defaultData.profile.experienceStartDate,
  };
};

const normalizeContactCards = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return defaultData.contact.cards;
  return rows.map((row, index) => ({
    id: String(row.id || `card-${index}`),
    type: row.type,
    label: row.label,
    value: row.value,
    href: row.href || '',
    color: row.color || 'accent-cyan',
  }));
};

export function PortfolioDataProvider({ children }) {
  const [content, setContent] = useState(defaultData);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      const [projects, gallery, certificates, skillsRows, profileRow, cardsRows] = await Promise.all([
        fetchSafe('projects'),
        fetchSafe('gallery'),
        fetchSafe('certificates'),
        fetchSafe('skills'),
        fetchSafe('profile'),
        fetchSafe('contact-cards'),
      ]);

      if (!active) return;

      const profile = normalizeProfile(profileRow);
      const cards = normalizeContactCards(cardsRows);

      setContent({
        gallery: normalizeGallery(gallery),
        certificates: normalizeCertificates(certificates),
        projects: normalizeProjects(projects),
        skills: normalizeSkills(skillsRows),
        experiences: defaultData.experiences,
        profile,
        contact: {
          title: profile.contactTitle || defaultData.contact.title,
          mapLabel: profile.mapLabel || defaultData.contact.mapLabel,
          cards,
        },
      });
    };

    loadContent();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      gallery: sortLatestFirst(content.gallery),
      certificates: sortLatestFirst(content.certificates),
      projects: sortLatestFirst(content.projects),
      skills: content.skills,
      experiences: content.experiences || defaultData.experiences,
      profile: content.profile,
      contact: content.contact,
    }),
    [content]
  );

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used inside PortfolioDataProvider');
  }
  return context;
}

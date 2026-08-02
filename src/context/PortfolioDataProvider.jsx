'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Gallery_01, Cert, Projects1, Self } from '@/assets/data/data';

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
    { name: 'Java', level: 'Experienced' },
    { name: 'Python', level: 'Experienced' },
    { name: 'SQL', level: 'Experienced' },
    { name: 'HTML/CSS', level: 'Experienced' },
  ],
  frameworks: [
    { name: 'React', level: 'Intermediate' },
    { name: 'Next.js', level: 'Basic' },
    { name: 'Nest.js', level: 'Intermediate' },
    { name: 'Java Spring', level: 'Basic' },
  ],
  databases: [
    { name: 'PostgreSQL', level: 'Intermediate' },
    { name: 'MySQL', level: 'Intermediate' },
    { name: 'MongoDB', level: 'Intermediate' },
  ],
  tools: [
    { name: 'Git', level: 'Intermediate' },
    { name: 'System Design', level: 'Intermediate' },
    { name: 'DSA', level: 'Intermediate' },
    { name: 'MS Office', level: 'Intermediate' },
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
    'I am Mustakim Billah Rafi, a full-stack developer with expertise in backend development, database management, and system design. I work with NestJS to build scalable microservices, manage PostgreSQL for efficient data handling, and design reliable software architectures.',
  aboutP2:
    'I have a strong interest in AI and Machine Learning, particularly in exploring how AI agents can effectively integrate with software systems using MCP servers. Currently pursuing a BSc in Computer Science and Engineering, I am expanding my skills in DevOps.',
  quote: 'Code with scalability, design with purpose, and learn without limits.',
  heroSubtitle: 'Hello, I am',
  heroHeading: '',
  heroTagline:
    'Building scalable and high-performance backend systems with NestJS, designing efficient and reliable databases using PostgreSQL and exploring AI integration into systems to create smarter digital solutions.',
  contactTitle: "Let's work together",
  contactSubtitle: '',
  mapLabel: 'Dhaka, Bangladesh',
  experienceStartDate: '2025-07-01',
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
      img: projectImages[index % projectImages.length] || projectImages[0] || '',
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
    })),
    'gallery'
  );
};

const normalizeCertificates = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return defaultData.certificates;
  return withIds(
    rows.map((row, index) => ({
      id: String(row.id),
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now() - index * 1000,
      img: certificateImage,
      title: row.title || 'Professional Certificate',
      issuer: row.issuer || '',
      date: row.date || '',
      credential_url: row.credential_url || '',
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

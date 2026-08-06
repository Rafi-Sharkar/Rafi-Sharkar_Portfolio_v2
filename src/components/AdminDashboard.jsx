'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HiAcademicCap,
  HiCollection,
  HiLogout,
  HiPhone,
  HiPencilAlt,
  HiPhotograph,
  HiTrash,
  HiUserCircle,
  HiMail,
  HiLightningBolt,
  HiLocationMarker,
  HiEye,
  HiRefresh,
  HiExternalLink,
  HiX,
  HiUpload,
  HiVideoCamera,
} from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdminAuth } from '@/context/AdminAuthProvider';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  getProfile,
  updateProfile,
  uploadMedia,
} from '@/lib/adminApi';

const sectionTabs = [
  { key: 'profile', label: 'Profile', icon: HiUserCircle },
  { key: 'contact-info', label: 'Contact Info', icon: HiMail },
  { key: 'skills', label: 'Skills', icon: HiLightningBolt },
  { key: 'projects', label: 'Projects', icon: HiCollection },
  { key: 'gallery', label: 'Gallery', icon: HiPhotograph },
  { key: 'certificates', label: 'Certificates', icon: HiAcademicCap },
  { key: 'contacts', label: 'Messages', icon: HiPhone },
];

// Which public page best previews the data being edited in each tab.
// Public pages render their own copy of the data via usePortfolioData(),
// so the iframe will pick up any DB changes after a manual refresh.
const TAB_PREVIEW_URL = {
  profile: '/',
  'contact-info': '/contact',
  skills: '/',
  projects: '/projects',
  gallery: '/gallery',
  certificates: '/certificates',
  contacts: '/contact',
};

const emptyProject = { title: '', description: '', github_link: '', live_link: '', image_url: '' };
const emptyGallery = { image_url: '', caption: '', title: '', story: '' };
const emptyCertificate = { title: '', issuer: '', date: '', credential_url: '', image_url: '', description: '' };
const emptySkill = { name: '', level: 'Intermediate', category: 'languages', order: 0 };
const emptyContactCard = {
  type: 'email',
  label: '',
  value: '',
  href: '',
  color: 'accent-cyan',
  order: 0,
};

const emptyProfile = {
  name: '',
  jobTitle: '',
  bio: '',
  profilePic: '',
  coverPic: '',
  cvUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  aboutP1: '',
  aboutP2: '',
  quote: '',
  heroSubtitle: '',
  heroHeading: '',
  heroTagline: '',
  contactTitle: '',
  contactSubtitle: '',
  mapLabel: '',
  experienceStartDate: '',
};

const SKILL_CATEGORIES = [
  { value: 'languages', label: 'Languages' },
  { value: 'frameworks', label: 'Frameworks' },
  { value: 'databases', label: 'Databases' },
  { value: 'tools', label: 'Tools' },
];

const CONTACT_CARD_TYPES = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'location', label: 'Location' },
];

const COLOR_PRESETS = [
  'accent-cyan',
  'accent-purple',
  'accent-pink',
  'accent-emerald',
  'from-green-400 to-emerald-600',
  'from-blue-400 to-indigo-600',
  'from-pink-400 to-rose-600',
];

export default function AdminDashboard() {
  const { logout, user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editId, setEditId] = useState(null);

  const [data, setData] = useState({
    projects: [],
    gallery: [],
    certificates: [],
    contacts: [],
    skills: [],
    contactCards: [],
    profile: null,
  });
  const [forms, setForms] = useState({
    projects: emptyProject,
    gallery: emptyGallery,
    certificates: emptyCertificate,
    skills: emptySkill,
    contactCards: emptyContactCard,
    profile: emptyProfile,
  });
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] = useState({ message: '', type: 'success' });

  // Live preview modal — iframe showing the relevant public page.
  // `previewKey` is bumped to force a remount (and thus a re-fetch) on Refresh.
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const showConfirmation = (message, type = 'success') => {
    setConfirmation({ message, type });
  };

  const setField = (tab, field, value) => {
    setForms((prev) => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }));
  };

  const resetForm = (tab) => {
    const map = {
      projects: emptyProject,
      gallery: emptyGallery,
      certificates: emptyCertificate,
      skills: emptySkill,
      contactCards: emptyContactCard,
    };
    if (map[tab]) setForms((prev) => ({ ...prev, [tab]: map[tab] }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [projects, gallery, certificates, contacts, skills, contactCards, profile] =
        await Promise.all([
          apiGet('projects').catch(() => []),
          apiGet('gallery').catch(() => []),
          apiGet('certificates').catch(() => []),
          apiGet('contacts').catch(() => []),
          apiGet('skills').catch(() => []),
          apiGet('contact-cards').catch(() => []),
          getProfile().catch(() => null),
        ]);

      setData({
        projects: Array.isArray(projects) ? projects : [],
        gallery: Array.isArray(gallery) ? gallery : [],
        certificates: Array.isArray(certificates) ? certificates : [],
        contacts: Array.isArray(contacts) ? contacts : [],
        skills: Array.isArray(skills) ? skills : [],
        contactCards: Array.isArray(contactCards) ? contactCards : [],
        profile: profile || null,
      });

      if (profile) {
        setForms((prev) => ({
          ...prev,
          profile: {
            ...emptyProfile,
            ...profile,
            experienceStartDate: profile.experienceStartDate
              ? String(profile.experienceStartDate).slice(0, 10)
              : '',
          },
        }));
      }
    } catch (error) {
      showConfirmation(error.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!confirmation.message) return undefined;
    const timer = setTimeout(() => setConfirmation({ message: '', type: 'success' }), 2800);
    return () => clearTimeout(timer);
  }, [confirmation.message]);

  const startEdit = (tab, item) => {
    setActiveTab(tab);
    setEditId(item.id);
    if (tab === 'projects') {
      setForms((prev) => ({
        ...prev,
        projects: {
          title: item.title || '',
          description: item.description || '',
          github_link: item.github_link || '',
          live_link: item.live_link || '',
          image_url: item.image_url || '',
        },
      }));
    } else if (tab === 'gallery') {
      setForms((prev) => ({
        ...prev,
        gallery: {
          image_url: item.image_url || '',
          caption: item.caption || '',
          title: item.title || '',
          story: item.story || '',
        },
      }));
    } else if (tab === 'certificates') {
      setForms((prev) => ({
        ...prev,
        certificates: {
          title: item.title || '',
          issuer: item.issuer || '',
          date: item.date ? String(item.date).slice(0, 10) : '',
          credential_url: item.credential_url || '',
          image_url: item.image_url || '',
          description: item.description || '',
        },
      }));
    } else if (tab === 'skills') {
      setForms((prev) => ({
        ...prev,
        skills: {
          name: item.name || '',
          level: item.level || 'Intermediate',
          category: item.category || 'languages',
          order: Number.isFinite(item.order) ? item.order : 0,
        },
      }));
    } else if (tab === 'contactCards') {
      setForms((prev) => ({
        ...prev,
        contactCards: {
          type: item.type || 'email',
          label: item.label || '',
          value: item.value || '',
          href: item.href || '',
          color: item.color || 'accent-cyan',
          order: Number.isFinite(item.order) ? item.order : 0,
        },
      }));
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    resetForm(activeTab);
  };

  const saveProject = async () => {
    const payload = {
      title: forms.projects.title.trim(),
      description: forms.projects.description.trim(),
      github_link: forms.projects.github_link.trim(),
      live_link: forms.projects.live_link.trim(),
      image_url: forms.projects.image_url.trim() || null,
    };
    if (!payload.title || !payload.description) {
      throw new Error('Project title and description are required.');
    }
    if (editId) {
      await apiPut('projects', editId, payload);
      showConfirmation('Project updated.');
    } else {
      await apiPost('projects', payload);
      showConfirmation('Project created.');
    }
  };

  const saveGallery = async () => {
    const payload = {
      image_url: forms.gallery.image_url.trim(),
      caption: forms.gallery.caption.trim() || null,
      title: forms.gallery.title.trim() || null,
      story: forms.gallery.story.trim() || null,
    };
    if (!payload.image_url) throw new Error('Gallery image is required.');
    if (editId) {
      await apiPut('gallery', editId, payload);
      showConfirmation('Gallery item updated.');
    } else {
      await apiPost('gallery', payload);
      showConfirmation('Gallery item created.');
    }
  };

  const saveCertificate = async () => {
    const payload = {
      title: forms.certificates.title.trim(),
      issuer: forms.certificates.issuer.trim() || null,
      date: forms.certificates.date || null,
      credential_url: forms.certificates.credential_url.trim() || null,
      image_url: forms.certificates.image_url.trim() || null,
      description: forms.certificates.description.trim() || null,
    };
    if (!payload.title) throw new Error('Certificate title is required.');
    if (editId) {
      await apiPut('certificates', editId, payload);
      showConfirmation('Certificate updated.');
    } else {
      await apiPost('certificates', payload);
      showConfirmation('Certificate created.');
    }
  };

  const saveSkill = async () => {
    const payload = {
      name: forms.skills.name.trim(),
      level: forms.skills.level,
      category: forms.skills.category,
      order: Number(forms.skills.order) || 0,
    };
    if (!payload.name) throw new Error('Skill name is required.');
    if (editId) {
      await apiPut('skills', editId, payload);
      showConfirmation('Skill updated.');
    } else {
      await apiPost('skills', payload);
      showConfirmation('Skill created.');
    }
  };

  const saveContactCard = async () => {
    const payload = {
      type: forms.contactCards.type,
      label: forms.contactCards.label.trim(),
      value: forms.contactCards.value.trim(),
      href: forms.contactCards.href.trim() || null,
      color: forms.contactCards.color,
      order: Number(forms.contactCards.order) || 0,
    };
    if (!payload.label || !payload.value) {
      throw new Error('Contact card label and value are required.');
    }
    if (editId) {
      await apiPut('contact-cards', editId, payload);
      showConfirmation('Contact card updated.');
    } else {
      await apiPost('contact-cards', payload);
      showConfirmation('Contact card created.');
    }
  };

  const saveProfile = async () => {
    const payload = { ...forms.profile };
    if (!payload.experienceStartDate) {
      delete payload.experienceStartDate;
    }
    await updateProfile(payload);
    showConfirmation('Profile saved.');
  };

  const onSave = async () => {
    try {
      if (activeTab === 'projects') await saveProject();
      else if (activeTab === 'gallery') await saveGallery();
      else if (activeTab === 'certificates') await saveCertificate();
      else if (activeTab === 'skills') await saveSkill();
      else if (activeTab === 'contactCards') await saveContactCard();
      else if (activeTab === 'profile') {
        await saveProfile();
        await loadData();
        return;
      } else {
        await loadData();
        return;
      }
      setEditId(null);
      resetForm(activeTab);
      await loadData();
    } catch (error) {
      showConfirmation(error.message || 'Save failed', 'error');
    }
  };

  const onDelete = async (id) => {
    try {
      if (activeTab === 'projects') await apiDelete('projects', id);
      else if (activeTab === 'gallery') await apiDelete('gallery', id);
      else if (activeTab === 'certificates') await apiDelete('certificates', id);
      else if (activeTab === 'skills') await apiDelete('skills', id);
      else if (activeTab === 'contactCards') await apiDelete('contact-cards', id);
      else if (activeTab === 'contacts') await apiDelete('contacts', id);
      showConfirmation('Item deleted.');
      await loadData();
    } catch (error) {
      showConfirmation(error.message || 'Delete failed', 'error');
    }
  };

  const currentItems = data[activeTab] || [];

  const formTitle = (() => {
    if (activeTab === 'contacts') return 'Contact Messages';
    if (activeTab === 'profile') return 'Profile & UI Content';
    if (activeTab === 'contactCards') return editId ? 'Edit Contact Card' : 'Add Contact Card';
    if (activeTab === 'skills') return editId ? 'Edit Skill' : 'Add Skill';
    const noun = activeTab === 'certificates' ? 'Certificate' : activeTab === 'gallery' ? 'Gallery Item' : 'Project';
    return `${editId ? 'Edit' : 'Add'} ${noun}`;
  })();

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-8">
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="section-subtitle">Control Panel</p>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold">Admin Dashboard</h1>
              {user?.username && (
                <p className="text-xs text-gray-500 mt-1">Signed in as {user.username}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewOpen(true)}
                className="btn-secondary px-4 py-2 text-sm inline-flex items-center gap-2"
                title="Preview the public site for this section"
              >
                <HiEye />
                Preview
              </button>
              <Link href="/" className="btn-secondary px-4 py-2 text-sm">
                View Portfolio
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl border border-red-400/40 text-red-300 hover:bg-red-500/10 transition-colors inline-flex items-center gap-2"
              >
                <HiLogout />
                Logout
              </button>
            </div>
          </div>
        </div>

        {confirmation.message && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl border text-sm font-medium ${
              confirmation.type === 'error'
                ? 'border-red-400/40 bg-red-500/10 text-red-300'
                : 'border-green-400/40 bg-green-500/10 text-green-300'
            }`}
          >
            {confirmation.message}
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="card h-fit">
            <div className="space-y-2">
              {sectionTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setEditId(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${
                      activeTab === tab.key
                        ? 'bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan'
                        : 'bg-dark-900 border border-dark-700 hover:border-accent-cyan/20'
                    }`}
                  >
                    <Icon className="text-xl" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">{formTitle}</h2>

              {activeTab === 'profile' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name">
                    <input value={forms.profile.name} onChange={(e) => setField('profile', 'name', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Job Title">
                    <input value={forms.profile.jobTitle} onChange={(e) => setField('profile', 'jobTitle', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Hero Subtitle">
                    <input value={forms.profile.heroSubtitle} onChange={(e) => setField('profile', 'heroSubtitle', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Hero Heading">
                    <input value={forms.profile.heroHeading} onChange={(e) => setField('profile', 'heroHeading', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Quote" full>
                    <input value={forms.profile.quote} onChange={(e) => setField('profile', 'quote', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Bio" full>
                    <textarea value={forms.profile.bio} onChange={(e) => setField('profile', 'bio', e.target.value)} rows={3} className={inputCls} />
                  </Field>
                  <Field label="Hero Tagline" full>
                    <textarea value={forms.profile.heroTagline} onChange={(e) => setField('profile', 'heroTagline', e.target.value)} rows={3} className={inputCls} />
                  </Field>
                  <Field label="About paragraph 1" full>
                    <textarea value={forms.profile.aboutP1} onChange={(e) => setField('profile', 'aboutP1', e.target.value)} rows={4} className={inputCls} />
                  </Field>
                  <Field label="About paragraph 2" full>
                    <textarea value={forms.profile.aboutP2} onChange={(e) => setField('profile', 'aboutP2', e.target.value)} rows={4} className={inputCls} />
                  </Field>
                  <Field label="Profile picture URL">
                    <input value={forms.profile.profilePic} onChange={(e) => setField('profile', 'profilePic', e.target.value)} className={inputCls} placeholder="/photos/profile.jpg" />
                  </Field>
                  <Field label="Cover picture URL">
                    <input value={forms.profile.coverPic} onChange={(e) => setField('profile', 'coverPic', e.target.value)} className={inputCls} placeholder="/photos/cover.jpg" />
                  </Field>
                  <MediaUploadField
                    label="Profile picture (upload)"
                    folder="profile"
                    value={forms.profile.profilePic}
                    onChange={(url) => setField('profile', 'profilePic', url)}
                  />
                  <MediaUploadField
                    label="Cover picture (upload)"
                    folder="profile"
                    value={forms.profile.coverPic}
                    onChange={(url) => setField('profile', 'coverPic', url)}
                  />
                  <Field label="CV URL">
                    <input value={forms.profile.cvUrl} onChange={(e) => setField('profile', 'cvUrl', e.target.value)} className={inputCls} placeholder="/documents/MUSTAKIM_BILLAH_RAFI.pdf" />
                  </Field>
                  <Field label="GitHub URL">
                    <input value={forms.profile.githubUrl} onChange={(e) => setField('profile', 'githubUrl', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="LinkedIn URL">
                    <input value={forms.profile.linkedinUrl} onChange={(e) => setField('profile', 'linkedinUrl', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Facebook URL">
                    <input value={forms.profile.facebookUrl} onChange={(e) => setField('profile', 'facebookUrl', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Instagram URL">
                    <input value={forms.profile.instagramUrl} onChange={(e) => setField('profile', 'instagramUrl', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Contact Title">
                    <input value={forms.profile.contactTitle} onChange={(e) => setField('profile', 'contactTitle', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Contact Subtitle">
                    <input value={forms.profile.contactSubtitle} onChange={(e) => setField('profile', 'contactSubtitle', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Map Label">
                    <input value={forms.profile.mapLabel} onChange={(e) => setField('profile', 'mapLabel', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Experience Start Date">
                    <input type="date" value={forms.profile.experienceStartDate} onChange={(e) => setField('profile', 'experienceStartDate', e.target.value)} className={inputCls} />
                  </Field>
                </div>
              )}

              {activeTab === 'contact-info' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Manage the contact cards that appear on the home page. Changes are reflected immediately.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={<span className="inline-flex items-center gap-1"><HiPhone className="text-base" /> Type</span>}>
                      <select
                        value={forms.contactCards.type}
                        onChange={(e) => setField('contactCards', 'type', e.target.value)}
                        className={inputCls}
                      >
                        {CONTACT_CARD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Label">
                      <input value={forms.contactCards.label} onChange={(e) => setField('contactCards', 'label', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Value">
                      <input value={forms.contactCards.value} onChange={(e) => setField('contactCards', 'value', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Href (optional)">
                      <input value={forms.contactCards.href} onChange={(e) => setField('contactCards', 'href', e.target.value)} className={inputCls} placeholder="mailto:... or tel:..." />
                    </Field>
                    <Field label="Color">
                      <select
                        value={forms.contactCards.color}
                        onChange={(e) => setField('contactCards', 'color', e.target.value)}
                        className={inputCls}
                      >
                        {COLOR_PRESETS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Order">
                      <input type="number" value={forms.contactCards.order} onChange={(e) => setField('contactCards', 'order', e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name">
                    <input value={forms.skills.name} onChange={(e) => setField('skills', 'name', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Level">
                    <select value={forms.skills.level} onChange={(e) => setField('skills', 'level', e.target.value)} className={inputCls}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Experienced</option>
                    </select>
                  </Field>
                  <Field label="Category">
                    <select value={forms.skills.category} onChange={(e) => setField('skills', 'category', e.target.value)} className={inputCls}>
                      {SKILL_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Order">
                    <input type="number" value={forms.skills.order} onChange={(e) => setField('skills', 'order', e.target.value)} className={inputCls} />
                  </Field>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <MediaUploadField
                    label="Project thumbnail"
                    folder="projects"
                    value={forms.projects.image_url}
                    onChange={(url) => setField('projects', 'image_url', url)}
                  />
                  <Field label="Title">
                    <input
                      value={forms.projects.title}
                      onChange={(e) => setField('projects', 'title', e.target.value)}
                      placeholder="Project title"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      value={forms.projects.description}
                      onChange={(e) => setField('projects', 'description', e.target.value)}
                      placeholder="Project description"
                      rows={4}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="GitHub link">
                    <input
                      value={forms.projects.github_link}
                      onChange={(e) => setField('projects', 'github_link', e.target.value)}
                      placeholder="https://github.com/..."
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Live link (optional)">
                    <input
                      value={forms.projects.live_link}
                      onChange={(e) => setField('projects', 'live_link', e.target.value)}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <MediaUploadField
                    label="Photo"
                    folder="gallery"
                    value={forms.gallery.image_url}
                    onChange={(url) => setField('gallery', 'image_url', url)}
                  />
                  <Field label="Title">
                    <input
                      value={forms.gallery.title}
                      onChange={(e) => setField('gallery', 'title', e.target.value)}
                      placeholder="Photo title (optional)"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Story / Description">
                    <textarea
                      value={forms.gallery.story}
                      onChange={(e) => setField('gallery', 'story', e.target.value)}
                      placeholder="Tell the story behind this photo (optional)"
                      rows={4}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Caption (legacy)">
                    <input
                      value={forms.gallery.caption}
                      onChange={(e) => setField('gallery', 'caption', e.target.value)}
                      placeholder="Short caption (optional, legacy field)"
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="space-y-4">
                  <MediaUploadField
                    label="Certificate photo"
                    folder="certificates"
                    value={forms.certificates.image_url}
                    onChange={(url) => setField('certificates', 'image_url', url)}
                  />
                  <Field label="Title">
                    <input
                      value={forms.certificates.title}
                      onChange={(e) => setField('certificates', 'title', e.target.value)}
                      placeholder="Certificate title"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Issuer">
                    <input
                      value={forms.certificates.issuer}
                      onChange={(e) => setField('certificates', 'issuer', e.target.value)}
                      placeholder="Issuer (e.g. Coursera, AWS)"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Date earned">
                    <input
                      type="date"
                      value={forms.certificates.date}
                      onChange={(e) => setField('certificates', 'date', e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      value={forms.certificates.description}
                      onChange={(e) => setField('certificates', 'description', e.target.value)}
                      placeholder="What was this certificate for? (optional)"
                      rows={3}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Credential URL (optional)">
                    <input
                      value={forms.certificates.credential_url}
                      onChange={(e) => setField('certificates', 'credential_url', e.target.value)}
                      placeholder="https://credential.url/..."
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="space-y-3 text-sm text-gray-300">
                  <p>Incoming contact submissions are stored in PostgreSQL.</p>
                  <p>Total messages: {data.contacts.length}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                {activeTab !== 'contacts' && (
                  <button onClick={onSave} className="btn-primary px-6 py-2 text-sm" disabled={loading}>
                    {activeTab === 'profile' ? 'Save Profile' : editId ? 'Update' : 'Create'}
                  </button>
                )}
                {activeTab === 'contacts' && (
                  <button onClick={loadData} className="btn-primary px-6 py-2 text-sm" disabled={loading}>
                    Refresh Messages
                  </button>
                )}
                {editId && activeTab !== 'contacts' && activeTab !== 'profile' && (
                  <button onClick={cancelEdit} className="btn-secondary px-6 py-2 text-sm">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {activeTab !== 'profile' && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">
                  {activeTab === 'contacts' ? 'Messages' : activeTab === 'contactCards' ? 'Contact cards' : `Current ${activeTab}`}
                </h3>

                {loading ? (
                  <p className="text-gray-500 text-sm">Loading data...</p>
                ) : (
                  <div className="space-y-3">
                    {activeTab === 'contacts' &&
                      currentItems.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-dark-900 border border-dark-700 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-white">{item.name}</p>
                              <p className="text-sm text-gray-400">{item.email}</p>
                            </div>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-2 rounded-lg border border-red-400/40 text-red-300 hover:bg-red-500/10"
                            >
                              <HiTrash />
                            </button>
                          </div>
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">{item.message}</p>
                          <p className="text-xs text-gray-500">
                            {item.created_at ? new Date(item.created_at).toLocaleString() : item.id}
                          </p>
                        </div>
                      ))}

                    {activeTab === 'skills' &&
                      currentItems.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.category} • {item.level} • order {item.order}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit('skills', item)}
                              className="p-2 rounded-lg border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10"
                            >
                              <HiPencilAlt />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-2 rounded-lg border border-red-400/40 text-red-300 hover:bg-red-500/10"
                            >
                              <HiTrash />
                            </button>
                          </div>
                        </div>
                      ))}

                    {activeTab === 'contactCards' &&
                      currentItems.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-accent-cyan">
                              {item.type === 'phone' && <HiPhone />}
                              {item.type === 'email' && <HiMail />}
                              {item.type === 'location' && <HiLocationMarker />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{item.label}</p>
                              <p className="text-xs text-gray-500 truncate">{item.value}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit('contactCards', item)}
                              className="p-2 rounded-lg border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10"
                            >
                              <HiPencilAlt />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-2 rounded-lg border border-red-400/40 text-red-300 hover:bg-red-500/10"
                            >
                              <HiTrash />
                            </button>
                          </div>
                        </div>
                      ))}

                    {(activeTab === 'projects' || activeTab === 'gallery' || activeTab === 'certificates') &&
                      currentItems.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-dark-800 border border-dark-700 flex-shrink-0">
                              {item.image_url ? (
                                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">—</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              {activeTab === 'projects' && (
                                <>
                                  <p className="font-medium truncate">{item.title}</p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {item.description || 'No description'}
                                  </p>
                                  {item.github_link && (
                                    <p className="text-xs text-accent-cyan truncate">GH: {item.github_link}</p>
                                  )}
                                </>
                              )}
                              {activeTab === 'gallery' && (
                                <>
                                  <p className="font-medium truncate">{item.title || item.caption || 'Gallery image'}</p>
                                  {item.story && (
                                    <p className="text-xs text-gray-500 line-clamp-2">{item.story}</p>
                                  )}
                                </>
                              )}
                              {activeTab === 'certificates' && (
                                <>
                                  <p className="font-medium truncate">{item.title || 'Certificate'}</p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {item.issuer ? `${item.issuer}` : 'No issuer'}
                                    {item.date ? ` • ${String(item.date).slice(0, 10)}` : ''}
                                  </p>
                                  {item.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(activeTab, item)}
                              className="p-2 rounded-lg border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10"
                            >
                              <HiPencilAlt />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-2 rounded-lg border border-red-400/40 text-red-300 hover:bg-red-500/10"
                            >
                              <HiTrash />
                            </button>
                          </div>
                        </div>
                      ))}

                    {currentItems.length === 0 && <p className="text-gray-500 text-sm">No items found.</p>}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {previewOpen && (
          <PreviewModal
            key="preview-modal"
            url={TAB_PREVIEW_URL[activeTab] || '/'}
            previewKey={previewKey}
            onRefresh={() => setPreviewKey((k) => k + 1)}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = 'w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 focus:outline-none focus:border-accent-cyan text-white';

function Field({ label, full = false, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

// Reusable media upload input. Wraps a file picker + preview + Upload button.
// On success, the parent form's value is updated via `onChange(url)`. The
// `value` prop holds the current URL (from the DB) so editing an existing
// row shows the previously-uploaded preview without needing to re-upload.
//
// Props:
//   label      — field label
//   folder     — S3 folder: 'profile' | 'gallery' | 'certificates' | 'projects'
//   value      — current URL (may be empty)
//   onChange   — (newUrl) => void
//   accept     — optional accept attr (defaults to images only)
function MediaUploadField({ label, folder, value, onChange, accept = 'image/*' }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [error, setError] = useState('');

  // Revoke the object URL on unmount or when a new file is chosen to avoid
  // memory leaks. Browsers don't garbage-collect these aggressively.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setStatus('idle');
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const onUpload = async () => {
    if (!file) {
      setError('Choose a file first.');
      return;
    }
    setStatus('uploading');
    setError('');
    try {
      const result = await uploadMedia(file, folder);
      onChange(result.url);
      setStatus('done');
      // Clear the chosen file so the form shows the saved URL, not the
      // local blob preview anymore.
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Upload failed.');
    }
  };

  const onRemove = () => {
    onChange('');
    setFile(null);
    setStatus('idle');
    setError('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  // The preview to render — prefer the freshly-chosen local file, fall back
  // to the saved URL. Video files get a <video> element instead of <img>.
  const currentPreview = previewUrl || value || '';
  const isVideo = file?.type?.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(value || '');

  return (
    <div className="sm:col-span-2 space-y-2">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-32 h-32 rounded-xl overflow-hidden bg-dark-900 border border-dark-700 flex items-center justify-center flex-shrink-0">
          {currentPreview ? (
            isVideo ? (
              <video src={currentPreview} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={currentPreview} alt={label} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="text-gray-600 text-xs flex flex-col items-center gap-1">
              <HiPhotograph className="text-2xl" />
              <span>No media</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <label className="px-3 py-2 rounded-lg border border-dark-700 text-gray-300 hover:bg-dark-800 hover:text-white cursor-pointer text-sm inline-flex items-center gap-2 transition-colors">
              <HiUpload />
              {file ? 'Change file' : 'Choose file'}
              <input
                type="file"
                accept={accept}
                onChange={onPick}
                className="hidden"
                disabled={status === 'uploading'}
              />
            </label>
            <button
              type="button"
              onClick={onUpload}
              disabled={!file || status === 'uploading'}
              className="px-3 py-2 rounded-lg border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm inline-flex items-center gap-2 transition-colors"
            >
              <HiUpload />
              {status === 'uploading' ? 'Uploading...' : 'Upload'}
            </button>
            {(value || previewUrl) && (
              <button
                type="button"
                onClick={onRemove}
                disabled={status === 'uploading'}
                className="px-3 py-2 rounded-lg border border-red-400/40 text-red-300 hover:bg-red-500/10 disabled:opacity-50 text-sm inline-flex items-center gap-2 transition-colors"
              >
                <HiTrash />
                Remove
              </button>
            )}
          </div>
          {file && (
            <p className="text-xs text-gray-400 truncate">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
              {file.type?.startsWith('video/') && (
                <span className="ml-2 inline-flex items-center gap-1 text-accent-cyan">
                  <HiVideoCamera /> video
                </span>
              )}
            </p>
          )}
          {value && !file && (
            <p className="text-xs text-gray-500 truncate font-mono">{value}</p>
          )}
          {status === 'done' && !error && (
            <p className="text-xs text-green-400">Uploaded.</p>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// Live-preview modal: renders the public page that corresponds to the
// currently active dashboard tab inside an iframe. The iframe is keyed by
// `previewKey` so we can force a remount (and thus a fresh data fetch) when
// the user clicks Refresh after saving changes.
function PreviewModal({ url, previewKey, onRefresh, onClose }) {
  // Close on Escape — small UX nicety, mirrors the existing lightbox modals
  // in CertificatesPage.jsx and GalleryPage.jsx.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      key="preview-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        key="preview-panel"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        // Stop propagation so clicks inside the panel don't bubble up to the
        // backdrop's onClick={onClose}.
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-[90vh] rounded-2xl glass border border-dark-700 overflow-hidden flex flex-col"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-dark-700 bg-dark-900/60">
          <div className="flex items-center gap-2 min-w-0">
            <HiEye className="text-accent-cyan shrink-0" />
            <span className="text-sm text-gray-300 shrink-0">Preview</span>
            <span className="text-xs font-mono text-gray-500 truncate">· {url}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 rounded-lg border border-dark-700 text-gray-300 hover:bg-dark-800 hover:text-white transition-colors inline-flex items-center gap-1.5 text-sm"
              title="Reload the preview to pick up saved changes"
            >
              <HiRefresh />
              Refresh
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-dark-700 text-gray-300 hover:bg-dark-800 hover:text-white transition-colors inline-flex items-center gap-1.5 text-sm"
              title="Open in a new browser tab"
            >
              <HiExternalLink />
              Open
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg border border-dark-700 text-gray-300 hover:bg-dark-800 hover:text-white transition-colors inline-flex items-center justify-center"
              aria-label="Close preview"
            >
              <HiX />
            </button>
          </div>
        </div>

        {/* Iframe — white bg matches the public site's light theme. */}
        <iframe
          key={previewKey}
          src={url}
          title={`Preview of ${url}`}
          className="w-full flex-1 bg-white"
        />
      </motion.div>
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiAcademicCap,
  HiCollection,
  HiLogout,
  HiPhone,
  HiPencilAlt,
  HiPhotograph,
  HiTrash,
} from 'react-icons/hi'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/adminApi'

const sectionTabs = [
  { key: 'projects', label: 'Projects', icon: HiCollection },
  { key: 'gallery', label: 'Gallery', icon: HiPhotograph },
  { key: 'certificates', label: 'Certificates', icon: HiAcademicCap },
  { key: 'contacts', label: 'Contacts', icon: HiPhone },
]

const initialForms = {
  projects: { title: '', description: '', github_link: '', live_link: '' },
  gallery: { image_url: '', caption: '' },
  certificates: { title: '', issuer: '', date: '', credential_url: '' },
}

const tabTitle = {
  projects: 'Project',
  gallery: 'Gallery Item',
  certificates: 'Certificate',
}

const emptyState = { projects: [], gallery: [], certificates: [], contacts: [] }

export default function AdminDashboard() {
  const { logout } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('projects')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(initialForms)
  const [data, setData] = useState(emptyState)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [confirmation, setConfirmation] = useState({ message: '', type: 'success' })

  const showConfirmation = (message, type = 'success') => {
    setConfirmation({ message, type })
  }

  const resetTabForm = (tab) => {
    if (!initialForms[tab]) {
      return
    }

    setForm((prev) => ({ ...prev, [tab]: initialForms[tab] }))
  }

  const setTabField = (tab, field, value) => {
    setForm((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }))
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [projects, gallery, certificates, contacts] = await Promise.all([
        apiGet('getProjects'),
        apiGet('getGallery'),
        apiGet('getCertificates'),
        apiGet('getContacts'),
      ])

      setData({
        projects: Array.isArray(projects) ? projects : [],
        gallery: Array.isArray(gallery) ? gallery : [],
        certificates: Array.isArray(certificates) ? certificates : [],
        contacts: Array.isArray(contacts) ? contacts : [],
      })
    } catch (error) {
      setStatus(error.message)
      showConfirmation(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!confirmation.message) {
      return undefined
    }

    const timer = setTimeout(() => {
      setConfirmation({ message: '', type: 'success' })
    }, 2800)

    return () => clearTimeout(timer)
  }, [confirmation.message])

  const startEdit = (tab, item) => {
    setActiveTab(tab)
    setEditId(item.id)

    if (tab === 'projects') {
      setForm((prev) => ({
        ...prev,
        projects: {
          title: item.title || '',
          description: item.description || '',
          github_link: item.github_link || '',
          live_link: item.live_link || '',
        },
      }))
      return
    }

    if (tab === 'gallery') {
      setForm((prev) => ({
        ...prev,
        gallery: {
          image_url: item.image_url || '',
          caption: item.caption || '',
        },
      }))
      return
    }

    if (tab === 'certificates') {
      setForm((prev) => ({
        ...prev,
        certificates: {
          title: item.title || '',
          issuer: item.issuer || '',
          date: item.date ? String(item.date).slice(0, 10) : '',
          credential_url: item.credential_url || '',
        },
      }))
    }
  }

  const cancelEdit = () => {
    setEditId(null)
    resetTabForm(activeTab)
  }

  const saveProject = async () => {
    const payload = {
      title: form.projects.title.trim(),
      description: form.projects.description.trim(),
      github_link: form.projects.github_link.trim(),
      live_link: form.projects.live_link.trim(),
    }

    if (!payload.title || !payload.description) {
      throw new Error('Project title and description are required.')
    }

    if (editId) {
      await apiPut('updateProject', { id: editId, ...payload })
      showConfirmation('Project updated successfully.')
    } else {
      await apiPost('addProject', payload)
      showConfirmation('Project created successfully.')
    }
  }

  const saveGallery = async () => {
    const payload = {
      image_url: form.gallery.image_url.trim(),
      caption: form.gallery.caption.trim(),
    }

    if (!payload.image_url) {
      throw new Error('Gallery image URL is required.')
    }

    if (editId) {
      await apiPut('updateGallery', { id: editId, ...payload })
      showConfirmation('Gallery item updated successfully.')
    } else {
      await apiPost('addGallery', payload)
      showConfirmation('Gallery item created successfully.')
    }
  }

  const saveCertificate = async () => {
    const payload = {
      title: form.certificates.title.trim(),
      issuer: form.certificates.issuer.trim(),
      date: form.certificates.date || null,
      credential_url: form.certificates.credential_url.trim(),
    }

    if (!payload.title) {
      throw new Error('Certificate title is required.')
    }

    if (editId) {
      await apiPut('updateCertificate', { id: editId, ...payload })
      showConfirmation('Certificate updated successfully.')
    } else {
      await apiPost('addCertificate', payload)
      showConfirmation('Certificate created successfully.')
    }
  }

  const onSave = async () => {
    setStatus('')

    try {
      if (activeTab === 'projects') {
        await saveProject()
      } else if (activeTab === 'gallery') {
        await saveGallery()
      } else if (activeTab === 'certificates') {
        await saveCertificate()
      } else {
        await loadData()
        showConfirmation('Contact messages refreshed.')
        return
      }

      setEditId(null)
      resetTabForm(activeTab)
      await loadData()
    } catch (error) {
      setStatus(error.message)
      showConfirmation(error.message, 'error')
    }
  }

  const onDelete = async (id) => {
    setStatus('')

    try {
      if (activeTab === 'projects') {
        await apiDelete('deleteProject', id)
      } else if (activeTab === 'gallery') {
        await apiDelete('deleteGallery', id)
      } else if (activeTab === 'certificates') {
        await apiDelete('deleteCertificate', id)
      } else {
        await apiDelete('deleteContact', id)
      }

      showConfirmation('Item deleted successfully.')
      await loadData()
    } catch (error) {
      setStatus(error.message)
      showConfirmation(error.message, 'error')
    }
  }

  const currentItems = data[activeTab] || []

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-8">
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="section-subtitle">Control Panel</p>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="btn-secondary px-4 py-2 text-sm">
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

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          <aside className="card h-fit">
            <div className="space-y-2">
              {sectionTabs.map((tab) => {
                const Icon = tab.icon

                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key)
                      setEditId(null)
                      setStatus('')
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
                )
              })}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                {activeTab === 'contacts'
                  ? 'Contact Messages'
                  : `${editId ? 'Edit' : 'Add'} ${tabTitle[activeTab]}`}
              </h2>

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <input
                    value={form.projects.title}
                    onChange={(event) => setTabField('projects', 'title', event.target.value)}
                    placeholder="Project title"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <textarea
                    value={form.projects.description}
                    onChange={(event) => setTabField('projects', 'description', event.target.value)}
                    placeholder="Project description"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.projects.github_link}
                    onChange={(event) => setTabField('projects', 'github_link', event.target.value)}
                    placeholder="GitHub link"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.projects.live_link}
                    onChange={(event) => setTabField('projects', 'live_link', event.target.value)}
                    placeholder="Live link (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <input
                    value={form.gallery.image_url}
                    onChange={(event) => setTabField('gallery', 'image_url', event.target.value)}
                    placeholder="Image URL"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.gallery.caption}
                    onChange={(event) => setTabField('gallery', 'caption', event.target.value)}
                    placeholder="Caption (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="space-y-4">
                  <input
                    value={form.certificates.title}
                    onChange={(event) => setTabField('certificates', 'title', event.target.value)}
                    placeholder="Certificate title"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.certificates.issuer}
                    onChange={(event) => setTabField('certificates', 'issuer', event.target.value)}
                    placeholder="Issuer"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    type="date"
                    value={form.certificates.date}
                    onChange={(event) => setTabField('certificates', 'date', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.certificates.credential_url}
                    onChange={(event) => setTabField('certificates', 'credential_url', event.target.value)}
                    placeholder="Credential URL"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
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
                    {editId ? 'Update' : 'Create'}
                  </button>
                )}
                {activeTab === 'contacts' && (
                  <button onClick={onSave} className="btn-primary px-6 py-2 text-sm" disabled={loading}>
                    Refresh Messages
                  </button>
                )}
                {editId && activeTab !== 'contacts' && (
                  <button onClick={cancelEdit} className="btn-secondary px-6 py-2 text-sm">
                    Cancel
                  </button>
                )}
              </div>

              {status && <p className="mt-3 text-sm text-accent-cyan">{status}</p>}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">
                Current {activeTab === 'contacts' ? 'messages' : activeTab}
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

                  {activeTab !== 'contacts' &&
                    currentItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-800 border border-dark-700 flex-shrink-0">
                            {activeTab === 'gallery' ? (
                              <img
                                src={item.image_url}
                                alt={item.caption || 'Gallery item'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">DB</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            {activeTab === 'projects' && <p className="font-medium truncate">{item.title}</p>}
                            {activeTab === 'gallery' && <p className="font-medium truncate">{item.caption || 'Gallery image'}</p>}
                            {activeTab === 'certificates' && <p className="font-medium truncate">{item.title || 'Certificate'}</p>}
                            <p className="text-xs text-gray-500 truncate">{item.id}</p>
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
          </section>
        </div>
      </div>
    </div>
  )
}

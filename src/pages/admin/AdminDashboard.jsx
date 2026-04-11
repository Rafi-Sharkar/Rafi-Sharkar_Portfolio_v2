import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiPencilAlt,
  HiTrash,
  HiLogout,
  HiPhotograph,
  HiAcademicCap,
  HiCollection,
  HiPhone,
} from 'react-icons/hi'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { usePortfolioData } from '../../context/PortfolioDataContext'

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to load image file.'))
    reader.readAsDataURL(file)
  })

const sectionTabs = [
  { key: 'gallery', label: 'Gallery', icon: HiPhotograph },
  { key: 'certificates', label: 'Certificates', icon: HiAcademicCap },
  { key: 'projects', label: 'Projects', icon: HiCollection },
  { key: 'contact', label: 'Contact', icon: HiPhone },
]

const initialForms = {
  gallery: { img: '' },
  certificates: { img: '', title: '' },
  projects: { name: '', img: '', scode: '', link: '' },
}

export default function AdminDashboard() {
  const { logout } = useAdminAuth()
  const {
    gallery,
    certificates,
    projects,
    contact,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    addCertificateItem,
    updateCertificateItem,
    deleteCertificateItem,
    addProjectItem,
    updateProjectItem,
    deleteProjectItem,
    updateContactContent,
  } = usePortfolioData()

  const [activeTab, setActiveTab] = useState('gallery')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(initialForms)
  const [contactForm, setContactForm] = useState({
    title: '',
    mapLabel: '',
    cards: [],
  })
  const [status, setStatus] = useState('')
  const [confirmation, setConfirmation] = useState({ message: '', type: 'success' })

  const itemsByTab = useMemo(
    () => ({
      gallery,
      certificates,
      projects,
    }),
    [gallery, certificates, projects],
  )

  useEffect(() => {
    setContactForm({
      title: contact?.title || '',
      mapLabel: contact?.mapLabel || '',
      cards: Array.isArray(contact?.cards) ? contact.cards.map((card) => ({ ...card })) : [],
    })
  }, [contact])

  useEffect(() => {
    if (!confirmation.message) {
      return
    }

    const timer = setTimeout(() => {
      setConfirmation({ message: '', type: 'success' })
    }, 2800)

    return () => clearTimeout(timer)
  }, [confirmation.message])

  const showConfirmation = (message, type = 'success') => {
    setConfirmation({ message, type })
  }

  const resetTabForm = (tab) => {
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

  const startEdit = (tab, item) => {
    setActiveTab(tab)
    setEditId(item.id)
    setForm((prev) => ({
      ...prev,
      [tab]: {
        ...initialForms[tab],
        ...item,
      },
    }))
  }

  const cancelEdit = () => {
    setEditId(null)
    resetTabForm(activeTab)
  }

  const ensureImage = (image) => image && image.trim() !== ''

  const saveGallery = () => {
    if (!ensureImage(form.gallery.img)) {
      setStatus('Gallery image is required.')
      showConfirmation('Gallery image is required.', 'error')
      return
    }

    if (editId) {
      updateGalleryItem(editId, { img: form.gallery.img.trim() })
      setStatus('Gallery item updated.')
      showConfirmation('Gallery item updated successfully.')
    } else {
      addGalleryItem({ img: form.gallery.img.trim() })
      setStatus('Gallery item added.')
      showConfirmation('Gallery item created successfully.')
    }

    setEditId(null)
    resetTabForm('gallery')
  }

  const saveCertificate = () => {
    if (!ensureImage(form.certificates.img)) {
      setStatus('Certificate image is required.')
      showConfirmation('Certificate image is required.', 'error')
      return
    }

    const payload = {
      img: form.certificates.img.trim(),
      title: form.certificates.title.trim(),
    }

    if (editId) {
      updateCertificateItem(editId, payload)
      setStatus('Certificate updated.')
      showConfirmation('Certificate updated successfully.')
    } else {
      addCertificateItem(payload)
      setStatus('Certificate added.')
      showConfirmation('Certificate created successfully.')
    }

    setEditId(null)
    resetTabForm('certificates')
  }

  const saveProject = () => {
    if (!form.projects.name.trim() || !ensureImage(form.projects.img) || !form.projects.scode.trim()) {
      setStatus('Project name, image, and source code link are required.')
      showConfirmation('Project name, image, and source code link are required.', 'error')
      return
    }

    const payload = {
      name: form.projects.name.trim(),
      img: form.projects.img.trim(),
      scode: form.projects.scode.trim(),
      link: form.projects.link.trim(),
    }

    if (editId) {
      updateProjectItem(editId, payload)
      setStatus('Project updated.')
      showConfirmation('Project updated successfully.')
    } else {
      addProjectItem(payload)
      setStatus('Project added.')
      showConfirmation('Project created successfully.')
    }

    setEditId(null)
    resetTabForm('projects')
  }

  const onSave = () => {
    if (activeTab === 'gallery') {
      saveGallery()
      return
    }

    if (activeTab === 'certificates') {
      saveCertificate()
      return
    }

    if (activeTab === 'contact') {
      updateContactContent({
        title: contactForm.title.trim(),
        mapLabel: contactForm.mapLabel.trim(),
        cards: contactForm.cards.map((card, index) => ({
          ...card,
          id: card.id || `contact-card-${index + 1}`,
          label: card.label.trim(),
          value: card.value.trim(),
          href: card.href?.trim() || '',
        })),
      })
      setStatus('Contact info updated.')
      showConfirmation('Contact info saved successfully.')
      return
    }

    saveProject()
  }

  const onDelete = (id) => {
    if (activeTab === 'gallery') {
      deleteGalleryItem(id)
      setStatus('Gallery item deleted.')
      return
    }

    if (activeTab === 'certificates') {
      deleteCertificateItem(id)
      setStatus('Certificate deleted.')
      return
    }

    deleteProjectItem(id)
    setStatus('Project deleted.')
  }

  const handleFileUpload = async (tab, file) => {
    if (!file) {
      return
    }

    try {
      const dataUrl = await readImageAsDataUrl(file)
      setTabField(tab, 'img', String(dataUrl))
      setStatus('Image uploaded.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const setContactField = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
  }

  const setContactCardField = (cardId, field, value) => {
    setContactForm((prev) => ({
      ...prev,
      cards: prev.cards.map((card) => (card.id === cardId ? { ...card, [field]: value } : card)),
    }))
  }

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
                {activeTab === 'contact'
                  ? 'Edit Contact Info'
                  : `${editId ? 'Edit' : 'Add'} ${activeTab.slice(0, 1).toUpperCase() + activeTab.slice(1)} Item`}
              </h2>

              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <input
                    value={form.gallery.img}
                    onChange={(event) => setTabField('gallery', 'img', event.target.value)}
                    placeholder="Image URL"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload('gallery', event.target.files?.[0])}
                    className="w-full text-sm text-gray-300"
                  />
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="space-y-4">
                  <input
                    value={form.certificates.title}
                    onChange={(event) => setTabField('certificates', 'title', event.target.value)}
                    placeholder="Certificate title (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.certificates.img}
                    onChange={(event) => setTabField('certificates', 'img', event.target.value)}
                    placeholder="Image URL"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload('certificates', event.target.files?.[0])}
                    className="w-full text-sm text-gray-300"
                  />
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <input
                    value={form.projects.name}
                    onChange={(event) => setTabField('projects', 'name', event.target.value)}
                    placeholder="Project name"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.projects.img}
                    onChange={(event) => setTabField('projects', 'img', event.target.value)}
                    placeholder="Image URL"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload('projects', event.target.files?.[0])}
                    className="w-full text-sm text-gray-300"
                  />
                  <input
                    value={form.projects.scode}
                    onChange={(event) => setTabField('projects', 'scode', event.target.value)}
                    placeholder="Source code URL"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                  <input
                    value={form.projects.link}
                    onChange={(event) => setTabField('projects', 'link', event.target.value)}
                    placeholder="Live URL (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                  />
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <input
                      value={contactForm.title}
                      onChange={(event) => setContactField('title', event.target.value)}
                      placeholder="Contact section title"
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                    />
                    <input
                      value={contactForm.mapLabel}
                      onChange={(event) => setContactField('mapLabel', event.target.value)}
                      placeholder="Map label"
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700"
                    />
                  </div>

                  <div className="space-y-4">
                    {contactForm.cards.map((card) => (
                      <div key={card.id} className="p-4 rounded-xl border border-dark-700 bg-dark-900/40 space-y-3">
                        <p className="text-sm font-medium text-gray-300">{card.label || 'Contact Card'}</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input
                            value={card.label}
                            onChange={(event) => setContactCardField(card.id, 'label', event.target.value)}
                            placeholder="Label"
                            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700"
                          />
                          <input
                            value={card.value}
                            onChange={(event) => setContactCardField(card.id, 'value', event.target.value)}
                            placeholder="Value"
                            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700"
                          />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <input
                            value={card.href || ''}
                            onChange={(event) => setContactCardField(card.id, 'href', event.target.value)}
                            placeholder={
                              card.type === 'email'
                                ? 'abc@gmail.com or mailto:abc@gmail.com'
                                : card.type === 'phone'
                                  ? '+8801... or tel:+8801...'
                                  : 'Google Maps URL or place text (e.g., Bashundhara Dhaka)'
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700 sm:col-span-2"
                          />
                          <select
                            value={card.type || 'location'}
                            onChange={(event) => setContactCardField(card.id, 'type', event.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700"
                          >
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="location">Location</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={onSave} className="btn-primary px-6 py-2 text-sm">
                  {activeTab === 'contact' ? 'Save Contact Info' : editId ? 'Update' : 'Create'}
                </button>
                {editId && activeTab !== 'contact' && (
                  <button onClick={cancelEdit} className="btn-secondary px-6 py-2 text-sm">
                    Cancel
                  </button>
                )}
              </div>
              {status && <p className="mt-3 text-sm text-accent-cyan">{status}</p>}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Current {activeTab}</h3>
              {activeTab === 'contact' && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-300">Cards: {contact.cards.length}</p>
                  <p className="text-sm text-gray-300">Map Label: {contact.mapLabel}</p>
                </div>
              )}
              <div className="space-y-3">
                {activeTab !== 'contact' && itemsByTab[activeTab].map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.img} alt="thumb" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="min-w-0">
                        {activeTab === 'projects' && (
                          <p className="font-medium truncate">{item.name}</p>
                        )}
                        {activeTab === 'certificates' && (
                          <p className="font-medium truncate">{item.title || 'Certificate'}</p>
                        )}
                        {activeTab === 'gallery' && <p className="font-medium truncate">Gallery Image</p>}
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

                {activeTab !== 'contact' && itemsByTab[activeTab].length === 0 && (
                  <p className="text-gray-500 text-sm">No items found.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Gallery_01, Cert, Projects1 } from '../assets/data/data'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'

const STORAGE_KEY = 'portfolio_dynamic_content_v1'
const CLOUD_COLLECTION = 'portfolio'
const CLOUD_DOCUMENT = 'content'

const PortfolioDataContext = createContext(null)

const withIds = (items, prefix) => {
  const baseTime = Date.now() - items.length * 1000

  return items.map((item, index) => ({
    id: item.id || `${prefix}-${index + 1}`,
    createdAt: item.createdAt || baseTime + index * 1000,
    ...item,
  }))
}

const sortLatestFirst = (items) =>
  [...items].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))

const defaultData = {
  gallery: withIds(Gallery_01, 'gallery'),
  certificates: withIds(Cert, 'certificate'),
  projects: withIds(Projects1, 'project'),
  contact: {
    title: "Let's work together",
    mapLabel: 'Dhaka, Bangladesh',
    cards: [
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
    ],
  },
}

const normalizeContent = (source) => ({
  gallery: withIds(Array.isArray(source?.gallery) ? source.gallery : defaultData.gallery, 'gallery'),
  certificates: withIds(
    Array.isArray(source?.certificates) ? source.certificates : defaultData.certificates,
    'certificate',
  ),
  projects: withIds(Array.isArray(source?.projects) ? source.projects : defaultData.projects, 'project'),
  contact: {
    title: source?.contact?.title || defaultData.contact.title,
    mapLabel: source?.contact?.mapLabel || defaultData.contact.mapLabel,
    cards:
      Array.isArray(source?.contact?.cards) && source.contact.cards.length > 0
        ? source.contact.cards
        : defaultData.contact.cards,
  },
})

const parseStoredData = () => {
  if (typeof window === 'undefined') {
    return defaultData
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultData
    }

    const parsed = JSON.parse(raw)

    return normalizeContent(parsed)
  } catch (error) {
    return defaultData
  }
}

const saveLocalData = (nextState) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
}

const saveCloudData = async (nextState) => {
  if (!isFirebaseConfigured || !db) {
    return
  }

  await setDoc(doc(db, CLOUD_COLLECTION, CLOUD_DOCUMENT), nextState, { merge: true })
}

export function PortfolioDataProvider({ children }) {
  const [content, setContent] = useState(parseStoredData)

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return undefined
    }

    const documentRef = doc(db, CLOUD_COLLECTION, CLOUD_DOCUMENT)

    const unsubscribe = onSnapshot(
      documentRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          await saveCloudData(parseStoredData())
          return
        }

        const normalized = normalizeContent(snapshot.data())
        setContent(normalized)
        saveLocalData(normalized)
      },
      () => {
        // Ignore cloud sync read failures and continue with local data.
      },
    )

    return () => unsubscribe()
  }, [])

  const updateContent = (updater) => {
    setContent((prev) => {
      const next = updater(prev)
      saveLocalData(next)
      saveCloudData(next).catch(() => {
        // Ignore cloud sync write failures and keep local updates.
      })
      return next
    })
  }

  const addGalleryItem = (item) => {
    updateContent((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { ...item, id: `gallery-${Date.now()}`, createdAt: Date.now() }],
    }))
  }

  const updateGalleryItem = (id, updates) => {
    updateContent((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }))
  }

  const deleteGalleryItem = (id) => {
    updateContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((item) => item.id !== id),
    }))
  }

  const addCertificateItem = (item) => {
    updateContent((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        { ...item, id: `certificate-${Date.now()}`, createdAt: Date.now() },
      ],
    }))
  }

  const updateCertificateItem = (id, updates) => {
    updateContent((prev) => ({
      ...prev,
      certificates: prev.certificates.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }))
  }

  const deleteCertificateItem = (id) => {
    updateContent((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((item) => item.id !== id),
    }))
  }

  const addProjectItem = (item) => {
    updateContent((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...item, id: `project-${Date.now()}`, createdAt: Date.now() }],
    }))
  }

  const updateProjectItem = (id, updates) => {
    updateContent((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }))
  }

  const deleteProjectItem = (id) => {
    updateContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }))
  }

  const updateContactContent = (contactUpdates) => {
    updateContent((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...contactUpdates,
      },
    }))
  }

  const value = useMemo(
    () => ({
      gallery: sortLatestFirst(content.gallery),
      certificates: sortLatestFirst(content.certificates),
      projects: sortLatestFirst(content.projects),
      contact: content.contact,
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
    }),
    [content],
  )

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext)

  if (!context) {
    throw new Error('usePortfolioData must be used inside PortfolioDataProvider')
  }

  return context
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Gallery_01, Cert, Projects1 } from '../assets/data/data'

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

const projectImages = Projects1.map((project) => project.img)
const certificateImage = Cert[0]?.img || ''

const fetchJson = async (functionName) => {
  const response = await fetch(`/.netlify/functions/${functionName}`)

  if (!response.ok) {
    throw new Error(`Failed to load ${functionName}`)
  }

  return response.json()
}

const normalizeProjects = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultData.projects
  }

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
    'project',
  )
}

const normalizeGallery = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultData.gallery
  }

  return withIds(
    rows.map((row, index) => ({
      id: String(row.id),
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now() - index * 1000,
      img: row.image_url || '',
      caption: row.caption || '',
    })),
    'gallery',
  )
}

const normalizeCertificates = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultData.certificates
  }

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
    'certificate',
  )
}

export function PortfolioDataProvider({ children }) {
  const [content, setContent] = useState(defaultData)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const [projects, gallery, certificates] = await Promise.all([
          fetchJson('getProjects'),
          fetchJson('getGallery'),
          fetchJson('getCertificates'),
        ])

        if (!active) {
          return
        }

        setContent({
          gallery: normalizeGallery(gallery),
          certificates: normalizeCertificates(certificates),
          projects: normalizeProjects(projects),
          contact: defaultData.contact,
        })
      } catch {
        if (active) {
          setContent(defaultData)
        }
      }
    }

    loadContent()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      gallery: sortLatestFirst(content.gallery),
      certificates: sortLatestFirst(content.certificates),
      projects: sortLatestFirst(content.projects),
      contact: content.contact,
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

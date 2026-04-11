import React, { createContext, useContext, useMemo, useState } from 'react'

const ADMIN_SESSION_KEY = 'portfolio_admin_session_v1'
const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || '',
  password: import.meta.env.VITE_ADMIN_PASSWORD || '',
}

const AdminAuthContext = createContext(null)

const getStoredSession = () => {
  if (typeof window === 'undefined') {
    return null 
  }

  return window.localStorage.getItem(ADMIN_SESSION_KEY)
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredSession()))

  const login = (username, password) => {
    if (!ADMIN_CREDENTIALS.username || !ADMIN_CREDENTIALS.password) {
      return {
        ok: false,
        message: 'Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in your environment.',
      }
    }

    const isValid =
      username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password

    if (!isValid) {
      return {
        ok: false,
        message: 'Invalid username or password.',
      }
    }

    window.localStorage.setItem(ADMIN_SESSION_KEY, String(Date.now()))
    setIsAuthenticated(true)

    return {
      ok: true,
      message: 'Login successful.',
    }
  }

  const logout = () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  }

  return context
}

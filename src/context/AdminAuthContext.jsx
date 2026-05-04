import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'

const ADMIN_SESSION_KEY = 'admin_session_v1'
const AdminAuthContext = createContext(null)

const getStoredSession = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(ADMIN_SESSION_KEY)
}

const setStoredSession = (value) => {
  if (typeof window === 'undefined') {
    return
  }

  if (!value) {
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
    return
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, String(value))
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredSession()))
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      const authenticated = Boolean(currentUser)
      setIsAuthenticated(authenticated)
      setStoredSession(authenticated ? currentUser.uid : null)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      return {
        ok: false,
        message: 'Firebase is not configured.',
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setIsAuthenticated(true)
      setStoredSession(userCredential.user?.uid || 'authenticated')
      return {
        ok: true,
        message: 'Login successful.',
      }
    } catch (error) {
      return {
        ok: false,
        message: error.message || 'Login failed. Please check your email and password.',
      }
    }
  }

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      setStoredSession(null)
      setUser(null)
      setIsAuthenticated(false)
      return
    }

    try {
      await signOut(auth)
      setStoredSession(null)
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
    }),
    [isAuthenticated, isLoading, user],
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

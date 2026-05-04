
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
const AdminAuthContext = createContext(null)

const getStoredSession = () => {
  if (typeof window === 'undefined') {
    return null 
  }

  return window.localStorage.getItem(ADMIN_SESSION_KEY)
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredSession()))

  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Monitor Firebase auth state
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
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
  }
    try {
      const userCredential = signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setIsAuthenticated(true)
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
      return
    }

    try {
      await signOut(auth)
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
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

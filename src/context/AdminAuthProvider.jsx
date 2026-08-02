'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authLogin, authLogout, authMe } from '@/lib/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bootstrapAvailable, setBootstrapAvailable] = useState(false);

  // Probe the server on mount to see if the user already has a valid cookie.
  useEffect(() => {
    let active = true;
    const probe = async () => {
      try {
        const result = await authMe();
        if (!active) return;
        setIsAuthenticated(Boolean(result?.authenticated));
        setUser(result?.user || null);
        setBootstrapAvailable(Boolean(result?.bootstrapAvailable));
      } catch (err) {
        if (!active) return;
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    probe();
    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const result = await authMe();
      setIsAuthenticated(Boolean(result?.authenticated));
      setUser(result?.user || null);
      setBootstrapAvailable(Boolean(result?.bootstrapAvailable));
      return result;
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      return { authenticated: false };
    }
  }, []);

  const login = useCallback(
    async (username, password) => {
      try {
        const result = await authLogin(username, password);
        if (result?.authenticated) {
          setIsAuthenticated(true);
          setUser(result.user || null);
          setBootstrapAvailable(false);
          return { ok: true, message: 'Login successful.' };
        }
        return { ok: false, message: result?.error || 'Login failed.' };
      } catch (err) {
        return { ok: false, message: err?.message || 'Login failed.' };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } catch (err) {
      console.error('Logout error', err);
    }
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
  }, [router]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      refresh,
      bootstrapAvailable,
    }),
    [isAuthenticated, isLoading, user, login, logout, refresh, bootstrapAvailable]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }
  return context;
}

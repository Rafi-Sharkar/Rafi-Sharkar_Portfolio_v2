'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/context/AdminAuthProvider';
import { DEFAULT_ADMIN } from '@/lib/seed-runtime';

export default function AdminLogin() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login, bootstrapAvailable, user } = useAdminAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(form.username.trim(), form.password);

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/admin/dashboard');
  };

  const useDefaultCredentials = () => {
    setForm({ username: DEFAULT_ADMIN.username, password: DEFAULT_ADMIN.password });
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md card"
      >
        <div className="mb-6 text-center">
          <p className="section-subtitle">Secure Area</p>
          <h1 className="text-3xl font-heading font-bold text-white">Admin Login</h1>
          {user?.username && (
            <p className="mt-2 text-xs text-gray-500">Signed in as {user.username}</p>
          )}
        </div>

        {bootstrapAvailable && (
          <div className="mb-4 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 text-sm">
            <p className="font-semibold mb-1">First run — default admin was just created.</p>
            <p>
              Username: <code className="px-1 rounded bg-black/30">{DEFAULT_ADMIN.username}</code>
              <br />
              Password: <code className="px-1 rounded bg-black/30">{DEFAULT_ADMIN.password}</code>
            </p>
            <button
              type="button"
              onClick={useDefaultCredentials}
              className="mt-2 text-xs underline text-yellow-100 hover:text-white"
            >
              Fill in default credentials
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 focus:outline-none focus:border-accent-cyan"
              placeholder="rafi_sharkar"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full px-4 py-3 pr-24 rounded-xl bg-dark-900 border border-dark-700 focus:outline-none focus:border-accent-cyan"
                placeholder="********"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-lg border border-dark-600 text-gray-300 hover:text-white hover:border-accent-cyan/40"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Use your admin username and password.</p>
          <Link href="/" className="text-accent-cyan hover:underline mt-2 inline-block">
            Return to portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

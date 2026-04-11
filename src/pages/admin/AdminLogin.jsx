import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAdminAuth()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const result = login(form.username.trim(), form.password)

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate('/admin/dashboard', { replace: true })
  }

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
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 focus:outline-none focus:border-accent-cyan"
              placeholder="admin"
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

          <button type="submit" className="w-full btn-primary">
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Credentials are loaded from environment variables.</p>
          <Link to="/" className="text-accent-cyan hover:underline mt-2 inline-block">
            Return to portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

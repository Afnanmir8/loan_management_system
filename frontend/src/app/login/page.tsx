'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function PasswordToggleButton({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3l18 18" />
          <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
          <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.44 18.44 0 0 1-2.69 4.11" />
          <path d="M6.61 6.61A18.46 18.46 0 0 0 2 12s3 7 10 7a10.94 10.94 0 0 0 4.11-.82" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAdmin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'borrower' | 'admin'>('borrower');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userType === 'borrower') {
        await login({ email: formData.email, password: formData.password });
        router.push('/borrower');
      } else {
        await loginAdmin({ email: formData.email, password: formData.password, role: formData.role });
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              LMS
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Login to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center font-medium ${
                userType === 'borrower'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="borrower"
                checked={userType === 'borrower'}
                onChange={(e) => setUserType(e.target.value as 'borrower' | 'admin')}
                className="mr-2"
              />
              Borrower
            </label>
            <label
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center font-medium ${
                userType === 'admin'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="admin"
                checked={userType === 'admin'}
                onChange={(e) => setUserType(e.target.value as 'borrower' | 'admin')}
                className="mr-2"
              />
              Admin
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field pr-12"
                />
                <PasswordToggleButton visible={showPassword} onClick={() => setShowPassword((current) => !current)} />
              </div>
            </div>

            {userType === 'admin' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} required className="input-field">
                  <option value="">Select your role</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                  <option value="sanction">Sanction</option>
                  <option value="disbursement">Disbursement</option>
                  <option value="collection">Collection</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {userType === 'borrower' && (
            <p className="mt-6 text-center text-gray-600">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign up now
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

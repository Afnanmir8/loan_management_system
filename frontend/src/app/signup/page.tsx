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

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'borrower',
    fullName: '',
    pan: '',
    dob: '',
    monthlySalary: '',
    employmentMode: 'Salaried',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({
        ...formData,
        monthlySalary: formData.role === 'borrower' ? Number(formData.monthlySalary) : undefined,
      });
      router.push(formData.role === 'borrower' ? '/borrower' : '/admin');
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="card mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            LMS
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Register a borrower or staff account</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Account Type
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                  <option value="borrower">Borrower</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                  <option value="sanction">Sanction</option>
                  <option value="disbursement">Disbursement</option>
                  <option value="collection">Collection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
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
                    minLength={6}
                    className="input-field pr-12"
                  />
                  <PasswordToggleButton visible={showPassword} onClick={() => setShowPassword((current) => !current)} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
            </div>
          </div>

          {formData.role === 'borrower' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PAN</label>
                    <input
                      type="text"
                      name="pan"
                      placeholder="ABCDE1234F"
                      value={formData.pan}
                      onChange={handleChange}
                      required
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      className="input-field uppercase"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 5 letters + 4 digits + 1 letter</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Salary</label>
                    <input
                      type="number"
                      name="monthlySalary"
                      placeholder="50000"
                      value={formData.monthlySalary}
                      onChange={handleChange}
                      required
                      min="25000"
                      className="input-field"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum ₹25,000</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Mode</label>
                    <select
                      name="employmentMode"
                      value={formData.employmentMode}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.role !== 'borrower' && (
            <div className="card bg-blue-50 border border-blue-100 text-sm text-blue-900">
              Staff accounts do not need borrower details. You can create admins or executive logins directly from this form.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed py-3 text-lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="card mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

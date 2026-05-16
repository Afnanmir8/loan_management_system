'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { borrowerAPI, loanAPI } from '@/lib/api';

export default function BorrowerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'apply'>('applications');

  useEffect(() => {
    if (!user || user.role !== 'borrower') {
      router.push('/login');
      return;
    }
    fetchLoans();
  }, [user, router]);

  const fetchLoans = async () => {
    try {
      const response = await borrowerAPI.getLoanApplications();
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back!</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="flex gap-3 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 My Applications
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'apply'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            ✍️ Apply for Loan
          </button>
        </div>

        {activeTab === 'applications' && <ApplicationsTab loans={loans} />}
        {activeTab === 'apply' && <ApplyTab onSuccess={fetchLoans} />}
      </div>
    </div>
  );
}

function ApplicationsTab({ loans }: { loans: any[] }) {
  return (
    <div>
      {loans.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-xl text-gray-600">No loan applications yet</p>
          <p className="text-gray-500">Start by applying for your first loan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Loan Application</h3>
                  <p className="text-sm text-gray-500">ID: {loan._id?.slice(-8)}</p>
                </div>
                <span className={`status-badge status-${loan.status.toLowerCase()}`}>
                  {loan.status}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Loan Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{loan.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tenure</p>
                  <p className="text-2xl font-bold text-gray-700">{loan.tenure}<span className="text-sm">days</span></p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Interest</p>
                  <p className="text-2xl font-bold text-gray-700">12%<span className="text-sm">p.a.</span></p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Repayment</p>
                  <p className="text-2xl font-bold text-green-600">₹{loan.totalRepayment.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ApplyTab({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({ loanAmount: 50000, tenure: 30 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [si, setSI] = useState(0);
  const [total, setTotal] = useState(0);

  React.useEffect(() => {
    calculateRepayment(formData.loanAmount, formData.tenure);
  }, []);

  const handleAmountChange = (amount: number) => {
    setFormData({ ...formData, loanAmount: amount });
    calculateRepayment(amount, formData.tenure);
  };

  const handleTenureChange = (tenure: number) => {
    setFormData({ ...formData, tenure });
    calculateRepayment(formData.loanAmount, tenure);
  };

  const calculateRepayment = (amount: number, tenure: number) => {
    const rate = 12;
    const interest = (amount * rate * tenure) / (365 * 100);
    setSI(Math.round(interest));
    setTotal(Math.round(amount + interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!file) {
      setError('Salary slip is required');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('loanAmount', formData.loanAmount.toString());
      formDataToSend.append('tenure', formData.tenure.toString());
      formDataToSend.append('salarySlip', file);

      await loanAPI.createLoan(formDataToSend);
      alert('Loan application submitted successfully!');
      onSuccess();
      setFormData({ loanAmount: 50000, tenure: 30 });
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to apply for loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Apply for a Loan</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="block font-bold text-gray-700">Loan Amount</label>
                <span className="text-2xl font-bold text-blue-600">₹{formData.loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="100000"
                step="5000"
                value={formData.loanAmount}
                onChange={(e) => handleAmountChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="block font-bold text-gray-700">Tenure (Loan Period)</label>
                <span className="text-2xl font-bold text-blue-600">{formData.tenure}<span className="text-sm text-gray-600">days</span></span>
              </div>
              <input
                type="range"
                min="30"
                max="365"
                step="1"
                value={formData.tenure}
                onChange={(e) => handleTenureChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-cyan-300 to-cyan-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>30 days</span>
                <span>365 days</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-3">Salary Slip</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-2xl mb-2">{file ? '✅' : '📎'}</p>
                <p className="font-semibold text-gray-700">{file ? file.name : 'Click to upload or drag'}</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed py-3 text-lg"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>

      <div>
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 sticky top-24">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Calculation Summary</h3>
          
          <div className="space-y-3">
            <div className="pb-3 border-b border-gray-300">
              <p className="text-xs font-semibold text-gray-500 uppercase">Principal Amount</p>
              <p className="text-2xl font-bold text-gray-800">₹{formData.loanAmount.toLocaleString()}</p>
            </div>

            <div className="pb-3 border-b border-gray-300">
              <p className="text-xs font-semibold text-gray-500 uppercase">Interest Rate</p>
              <p className="text-2xl font-bold text-gray-800">12%<span className="text-sm">p.a.</span></p>
            </div>

            <div className="pb-3 border-b border-gray-300">
              <p className="text-xs font-semibold text-gray-500 uppercase">Tenure</p>
              <p className="text-2xl font-bold text-gray-800">{formData.tenure}<span className="text-sm">days</span></p>
            </div>

            <div className="pb-3 border-b border-gray-300">
              <p className="text-xs font-semibold text-gray-500 uppercase">Simple Interest</p>
              <p className="text-2xl font-bold text-green-600">₹{si.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-lg mt-4">
              <p className="text-xs font-semibold uppercase opacity-90 mb-1">Total Repayment Amount</p>
              <p className="text-3xl font-bold">₹{total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


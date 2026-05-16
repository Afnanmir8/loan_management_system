'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loanAPI } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === 'borrower') {
      router.push('/login');
      return;
    }

    // Set initial module based on role
    const moduleMap: { [key: string]: string } = {
      admin: 'overview',
      sales: 'sales',
      sanction: 'sanction',
      disbursement: 'disbursement',
      collection: 'collection',
    };
    setActiveModule(moduleMap[user.role] || 'overview');
    setLoading(false);
  }, [user, router]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 md:p-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Operations Dashboard</h1>
            <p className="text-gray-600 capitalize">Welcome, <span className="font-semibold">{user?.role}</span></p>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold text-lg">
            {user?.role.toUpperCase()}
          </div>
        </div>

        <div className="mt-8">
          {user?.role === 'admin' && <AdminModule activeModule={activeModule} setActiveModule={setActiveModule} />}
          {user?.role === 'sales' && <SalesModule />}
          {user?.role === 'sanction' && <SanctionModule />}
          {user?.role === 'disbursement' && <DisbursementModule />}
          {user?.role === 'collection' && <CollectionModule />}
        </div>
      </div>
    </div>
  );
}

function AdminModule({ activeModule, setActiveModule }: any) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await loanAPI.getDashboardData();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">System Overview</h2>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon="⏳" 
          label="Pending" 
          value={stats?.pending || 0} 
          bgGradient="from-yellow-50 to-yellow-100"
          color="yellow"
        />
        <StatCard 
          icon="✅" 
          label="Sanctioned" 
          value={stats?.sanctioned || 0} 
          bgGradient="from-green-50 to-green-100"
          color="green"
        />
        <StatCard 
          icon="💰" 
          label="Disbursed" 
          value={stats?.disbursed || 0} 
          bgGradient="from-blue-50 to-blue-100"
          color="blue"
        />
        <StatCard 
          icon="🏁" 
          label="Closed" 
          value={stats?.closed || 0} 
          bgGradient="from-gray-50 to-gray-100"
          color="gray"
        />
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'sales', label: 'Sales', icon: '📈' },
            { id: 'sanction', label: 'Sanction', icon: '✔️' },
            { id: 'disbursement', label: 'Disbursement', icon: '💸' },
            { id: 'collection', label: 'Collection', icon: '💳' },
          ].map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`p-3 rounded-lg font-semibold transition-all duration-300 ${
                activeModule === module.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-1">{module.icon}</div>
              {module.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalesModule() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      setLoading(true);
      const response = await loanAPI.getSalesLoans();
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error('Failed to fetch sales loans:', error);
      alert('Failed to load pending applications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 Sales Module</h2>
          <p className="text-gray-600">Track pre-application stage loans and manage leads</p>
        </div>
        <span className="text-4xl opacity-50">📊</span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Loading pending applications...</p>
        ) : loans.length === 0 ? (
          <p className="text-gray-600">No pending applications.</p>
        ) : (
          loans.map((loan) => (
            <div key={loan._id} className="border border-gray-300 rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">₹{loan.loanAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{loan.tenure} days | Borrower: {loan.borrowerId?.fullName || 'N/A'}</p>
              </div>
              <div className="text-sm text-gray-600">Submitted: {new Date(loan.createdAt).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SanctionModule() {
  const [loans, setLoans] = useState<any[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await loanAPI.getSalesLoans();
        setLoans(response.data.loans || []);
      } catch (error) {
        console.error('Failed to fetch loans:', error);
      }
    };
    fetchLoans();
  }, []);

  const handleSanction = async (loanId: string, approved: boolean, reason?: string) => {
    setLoading(true);
    try {
      await loanAPI.sanctionLoan({ loanId, approved, reason });
      alert(`Loan ${approved ? 'approved' : 'rejected'} successfully!`);
      setLoans(loans.filter((l) => l._id !== loanId));
      setSelectedLoan(null);
    } catch (error) {
      console.error('Failed to sanction loan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Sanction Module</h2>

      {selectedLoan ? (
        <div>
          <button onClick={() => setSelectedLoan(null)} className="mb-4 text-blue-600 hover:underline">
            ← Back
          </button>
          <LoanSanctionForm
            loan={selectedLoan}
            onApprove={() => handleSanction(selectedLoan._id, true)}
            onReject={(reason) => handleSanction(selectedLoan._id, false, reason)}
            loading={loading}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {loans.length === 0 ? (
            <p className="text-gray-600">No applications to review.</p>
          ) : (
            loans.map((loan) => (
              <div key={loan._id} className="border border-gray-300 rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">₹{loan.loanAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{loan.tenure} days tenure</p>
                </div>
                <button
                  onClick={() => setSelectedLoan(loan)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Review
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function LoanSanctionForm({ loan, onApprove, onReject, loading }: any) {
  const [reason, setReason] = useState('');

  return (
    <div className="border border-gray-300 rounded p-6">
      <h3 className="text-xl font-bold mb-4">Loan Details</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="text-xl font-bold">₹{loan.loanAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tenure</p>
          <p className="text-xl font-bold">{loan.tenure} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">SI</p>
          <p className="text-xl font-bold">₹{loan.simpleInterest.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Repayment</p>
          <p className="text-xl font-bold">₹{loan.totalRepayment.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Reason (if rejecting)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
          placeholder="Enter reason for rejection..."
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onApprove}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(reason)}
          disabled={loading}
          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function DisbursementModule() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [disbursingId, setDisbursingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSanctionedLoans();
  }, []);

  const fetchSanctionedLoans = async () => {
    try {
      setLoading(true);
      const response = await loanAPI.getSanctionedLoans();
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Error fetching sanctioned loans:', error);
      alert('Failed to fetch sanctioned loans');
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (loanId: string) => {
    try {
      setDisbursingId(loanId);
      await loanAPI.disburseLoan({ loanId });
      alert('Loan disbursed successfully!');
      setSelectedLoan(null);
      fetchSanctionedLoans();
    } catch (error: any) {
      console.error('Error disbursing loan:', error);
      alert(error?.response?.data?.error || 'Failed to disburse loan');
    } finally {
      setDisbursingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Disbursement Module</h2>
      <p className="text-gray-600 mb-6">Manage disbursement of sanctioned loans.</p>

      {selectedLoan ? (
        <div>
          <button
            onClick={() => setSelectedLoan(null)}
            className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to List
          </button>
          <LoanDisbursementForm 
            loan={selectedLoan} 
            onDisburse={() => handleDisburse(selectedLoan._id)}
            loading={disbursingId === selectedLoan._id}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-600">Loading sanctioned loans...</p>
          ) : loans.length === 0 ? (
            <p className="text-gray-600">No sanctioned loans to disburse.</p>
          ) : (
            loans.map((loan) => (
              <div key={loan._id} className="border border-gray-300 rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">₹{loan.loanAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{loan.tenure} days | Borrower: {loan.borrowerId?.fullName || 'N/A'}</p>
                </div>
                <button
                  onClick={() => setSelectedLoan(loan)}
                  className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                >
                  Disburse
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function LoanDisbursementForm({ loan, onDisburse, loading }: any) {
  return (
    <div className="border border-gray-300 rounded p-6">
      <h3 className="text-xl font-bold mb-4">Disbursement Confirmation</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Loan Amount</p>
          <p className="text-xl font-bold">₹{loan.loanAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tenure</p>
          <p className="text-xl font-bold">{loan.tenure} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Simple Interest</p>
          <p className="text-xl font-bold">₹{loan.simpleInterest.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Repayment</p>
          <p className="text-xl font-bold">₹{loan.totalRepayment.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Borrower</p>
          <p className="text-xl font-bold">{loan.borrowerId?.fullName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-xl font-bold text-cyan-600">{loan.status}</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
        <p className="text-sm text-yellow-800">
          ✓ Clicking "Disburse" will transfer ₹{loan.loanAmount.toLocaleString()} to the borrower and activate the collection stage.
        </p>
      </div>

      <button
        onClick={onDisburse}
        disabled={loading}
        className="w-full bg-cyan-600 text-white py-3 rounded hover:bg-cyan-700 disabled:opacity-50 font-bold text-lg"
      >
        {loading ? 'Processing...' : 'Confirm Disbursement'}
      </button>
    </div>
  );
}

function CollectionModule() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  useEffect(() => {
    fetchDisbursedLoans();
  }, []);

  const fetchDisbursedLoans = async () => {
    try {
      setLoading(true);
      const response = await loanAPI.getDisbursedLoans();
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Error fetching disbursed loans:', error);
      alert('Failed to fetch disbursed loans');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (loanId: string, utrNumber: string, amount: number, paymentDate: string) => {
    try {
      await loanAPI.recordPayment({
        loanId,
        utrNumber,
        amount,
        paymentDate,
      });
      alert('Payment recorded successfully!');
      setSelectedLoan(null);
      fetchDisbursedLoans();
    } catch (error: any) {
      console.error('Error recording payment:', error);
      alert(error?.response?.data?.error || 'Failed to record payment');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Collection Module</h2>
      <p className="text-gray-600 mb-6">Record payments for active loans.</p>

      {selectedLoan ? (
        <div>
          <button
            onClick={() => setSelectedLoan(null)}
            className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to List
          </button>
          <LoanPaymentForm 
            loan={selectedLoan} 
            onRecordPayment={handleRecordPayment}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-600">Loading disbursed loans...</p>
          ) : loans.length === 0 ? (
            <p className="text-gray-600">No disbursed loans to collect from.</p>
          ) : (
            loans.map((loan) => (
              <div key={loan._id} className="border border-gray-300 rounded p-4 flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold">₹{loan.loanAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Borrower: {loan.borrowerId?.fullName}</p>
                  <p className="text-sm text-gray-600">Total Repayment: ₹{loan.totalRepayment.toLocaleString()}</p>
                  {loan.collections && loan.collections.length > 0 && (
                    <p className="text-sm text-green-600">Payments Made: {loan.collections.length}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedLoan(loan)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Record Payment
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function LoanPaymentForm({ loan, onRecordPayment }: any) {
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const totalPaid = (loan.collections || []).reduce((sum: number, c: any) => sum + c.amount, 0);
  const remainingBalance = loan.totalRepayment - totalPaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utrNumber.trim() || !amount || !paymentDate) {
      alert('Please fill in all fields');
      return;
    }

    const paymentAmount = Number(amount);
    if (paymentAmount <= 0 || paymentAmount > remainingBalance) {
      alert(`Payment amount must be between ₹1 and ₹${remainingBalance.toLocaleString()}`);
      return;
    }

    setLoading(true);
    try {
      await onRecordPayment(loan._id, utrNumber, paymentAmount, paymentDate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded p-6 space-y-4">
      <h3 className="text-xl font-bold mb-4">Record Payment</h3>

      {/* Payments history */}
      {loan.collections && loan.collections.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Payment History</h4>
          <div className="space-y-2">
            {loan.collections
              .slice()
              .sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
              .map((c: any) => (
                <div key={c._id || c.utrNumber} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="text-sm font-semibold">₹{Number(c.amount).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">UTR: {c.utrNumber || '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(c.paymentDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">By: {c.recordedBy || 'operator'}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded mb-6">
        <div>
          <p className="text-sm text-gray-600">Loan Amount</p>
          <p className="text-lg font-bold">₹{loan.loanAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Repayment</p>
          <p className="text-lg font-bold">₹{loan.totalRepayment.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Already Paid</p>
          <p className="text-lg font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Remaining Balance</p>
          <p className="text-lg font-bold text-red-600">₹{remainingBalance.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">UTR Number</label>
        <input
          type="text"
          value={utrNumber}
          onChange={(e) => setUtrNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="e.g., UTR123456789"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Payment Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder={`Max: ₹${remainingBalance.toLocaleString()}`}
          max={remainingBalance}
          min={1}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Payment Date</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 font-bold"
        >
          {loading ? 'Recording...' : 'Record Payment'}
        </button>
      </div>

      {loan.status === 'CLOSED' && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-sm text-green-800">✓ This loan has been fully repaid and is closed.</p>
        </div>
      )}
      </form>
    </div>
  );
}

function StatCard({ icon, label, value, bgGradient, color }: any) {
  const colors: { [key: string]: string } = {
    yellow: 'text-yellow-600 border-yellow-200',
    green: 'text-green-600 border-green-200',
    blue: 'text-blue-600 border-blue-200',
    cyan: 'text-cyan-600 border-cyan-200',
    gray: 'text-gray-600 border-gray-200',
  };

  return (
    <div className={`card bg-gradient-to-br ${bgGradient || 'from-blue-50 to-blue-100'} border-2 ${colors[color] || 'border-blue-200'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{label}</p>
          <p className="text-5xl font-bold text-gray-800">{value}</p>
        </div>
        <span className="text-4xl opacity-50">{icon}</span>
      </div>
    </div>
  );
}

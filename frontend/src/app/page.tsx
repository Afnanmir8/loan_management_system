'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20 md:py-32 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold mb-6">
              Welcome to Modern Lending
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Loan Management <br />
              <span className="text-cyan-200">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Fast approvals, transparent terms, and seamless digital experience
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-primary inline-block"
            >
              Apply for a Loan
            </Link>
            <Link
              href="/login"
              className="inline-block px-8 py-3 rounded-lg bg-white bg-opacity-20 text-white font-semibold hover:bg-opacity-30 transition-all duration-300 border-2 border-white border-opacity-50"
            >
              Executive Login
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Loans Processed' },
              { number: '₹500Cr+', label: 'Disbursed' },
              { number: '98%', label: 'Approval Rate' },
              { number: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Complete Lending Platform
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Borrower Features */}
            <div className="card border-l-4 border-blue-600 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  👤
                </div>
                <h3 className="text-2xl font-bold">For Borrowers</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Quick 4-step application</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Instant eligibility verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Secure salary slip upload</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Live loan calculator</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Real-time tracking</span>
                </li>
              </ul>
            </div>

            {/* Executive Features */}
            <div className="card border-l-4 border-cyan-600 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  👨‍💼
                </div>
                <h3 className="text-2xl font-bold">For Executives</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                  <span>Role-based dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                  <span>Sales lead management</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                  <span>Fast approval workflow</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                  <span>Disbursement tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                  <span>Collection management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Your Journey to a Loan</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create account', icon: '📝' },
              { step: '2', title: 'Check Eligibility', desc: 'Age 23-50, Salary ₹25K+', icon: '✓' },
              { step: '3', title: 'Upload Slip', desc: 'PDF or JPG/PNG', icon: '📄' },
              { step: '4', title: 'Get Approved', desc: 'Instant verification', icon: '🎉' },
            ].map((item, i) => (
              <div key={i} className="card text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="flex w-10 h-10 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of customers today</p>
          <Link href="/signup" className="btn-primary inline-block">
            Apply Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="container mx-auto text-center text-sm text-gray-400">
          <p>&copy; 2024 Loan Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

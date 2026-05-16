"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span className="text-lg font-bold text-blue-700">LMS</span>
          </div>
          <span className="text-2xl font-bold hidden sm:inline">Loan Management</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{user.email[0]?.toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-blue-100 capitalize">{user.role}</p>
              </div>
            </div>
            <Link
              href={user.role === 'borrower' ? '/borrower' : '/admin'}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 font-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

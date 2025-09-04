'use client';

import React from 'react';
import Link from 'next/link';

// Force this page to be dynamic - it's an admin panel
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your ZeroFinanx application settings
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Authentication Settings */}
          <Link href="/admin/auth-settings" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Authentication</h2>
                  <p className="text-sm text-gray-600">Configure login methods</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Choose between passwordless (magic link) or OAuth authentication methods
              </p>
              <div className="mt-4 text-blue-600 text-sm font-medium">
                Configure →
              </div>
            </div>
          </Link>

          {/* OAuth Settings */}
          <Link href="/admin/oauth" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">OAuth Providers</h2>
                  <p className="text-sm text-gray-600">Google & Apple Sign-In</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Configure OAuth provider credentials for social login
              </p>
              <div className="mt-4 text-purple-600 text-sm font-medium">
                Configure →
              </div>
            </div>
          </Link>

          {/* Stripe Settings */}
          <Link href="/admin/stripe" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Stripe Payments</h2>
                  <p className="text-sm text-gray-600">Subscription management</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Configure Stripe for payment processing and subscriptions
              </p>
              <div className="mt-4 text-green-600 text-sm font-medium">
                Configure →
              </div>
            </div>
          </Link>

          {/* Admin Guide */}
          <Link href="/admin/guide" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Admin Guide</h2>
                  <p className="text-sm text-gray-600">Documentation</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Complete guide for configuring and managing the application
              </p>
              <div className="mt-4 text-amber-600 text-sm font-medium">
                View Guide →
              </div>
            </div>
          </Link>

          {/* Setup Instructions */}
          <Link href="/admin/setup" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Setup Instructions</h2>
                  <p className="text-sm text-gray-600">Initial configuration</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Step-by-step instructions for initial application setup
              </p>
              <div className="mt-4 text-indigo-600 text-sm font-medium">
                View Instructions →
              </div>
            </div>
          </Link>

          {/* Lessons Management */}
          <Link href="/admin/lessons" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
                  <p className="text-sm text-gray-600">Educational content</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Add, edit, and manage educational lessons for users
              </p>
              <div className="mt-4 text-purple-600 text-sm font-medium">
                Manage Lessons →
              </div>
            </div>
          </Link>

          {/* Calculators Management */}
          <Link href="/admin/calculators" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Calculators</h2>
                  <p className="text-sm text-gray-600">Financial tools</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Add, edit, and manage financial calculators and tools
              </p>
              <div className="mt-4 text-blue-600 text-sm font-medium">
                Manage Calculators →
              </div>
            </div>
          </Link>

          {/* User Feedback */}
          <Link href="/admin/feedback" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">User Feedback</h2>
                  <p className="text-sm text-gray-600">Topics & feedback</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Review user feedback and topic suggestions from the dashboard
              </p>
              <div className="mt-4 text-green-600 text-sm font-medium">
                View Feedback →
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/admin/analytics" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
                  <p className="text-sm text-gray-600">Usage statistics</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                View user activity and subscription analytics
              </p>
              <div className="mt-4 text-rose-600 text-sm font-medium">
                View Analytics →
              </div>
            </div>
          </Link>

          {/* Database Management */}
          <Link href="/admin/database" className="block">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Database</h2>
                  <p className="text-sm text-gray-600">Export & Import</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Export database backups and import existing data
              </p>
              <div className="mt-4 text-cyan-600 text-sm font-medium">
                Manage Database →
              </div>
            </div>
          </Link>

        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Site
            </Link>
            <Link 
              href="/admin/guide" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Documentation
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh Page
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Authentication Status</h3>
          <p className="text-sm text-blue-700">
            Your application is currently configured to use <strong>passwordless authentication</strong> by default.
            Users will receive magic links via email to sign in. You can change this in the Authentication settings.
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import LessonManager from '@/components/LessonManager';
import StripeManager from '@/components/StripeManager';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'calculators' | 'stripe'>('dashboard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple demo authentication - in production, use proper auth
    if (email === 'admin@zerofinanx.com' && accessCode === 'demo123') {
      setIsAuthorized(true);
    } else {
      setError('Invalid admin credentials');
    }
  };

  if (isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Admin Header - Mobile Optimized */}
        <header className="border-b border-red-200 bg-red-50">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-red-900 truncate">ZeroFinanx Admin</h1>
                <p className="text-xs sm:text-sm text-red-700 truncate">Administrative Dashboard</p>
              </div>
              <div className="flex gap-2 sm:gap-3 ml-4">
                <a
                  href="/"
                  className="inline-flex items-center rounded-lg border border-red-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-900 hover:bg-red-100"
                >
                  Home
                </a>
                <button
                  onClick={() => setIsAuthorized(false)}
                  className="inline-flex items-center rounded-lg border border-red-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-900 hover:bg-red-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation - Mobile Optimized */}
        <nav className="border-b border-gray-200 bg-white overflow-x-auto">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex gap-4 sm:gap-6 min-w-max">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'lessons'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Lessons
              </button>
              <button
                onClick={() => setActiveTab('calculators')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'calculators'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Calculators
              </button>
              <button
                onClick={() => setActiveTab('stripe')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'stripe'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Stripe
              </button>
            </div>
          </div>
        </nav>

        {/* Admin Content - Mobile Optimized */}
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* System Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">System Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="text-sm text-green-600 font-medium">✓ Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cookie System</span>
                  <span className="text-sm text-green-600 font-medium">✓ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email System</span>
                  <span className="text-sm text-yellow-600 font-medium">⚠ Demo Mode</span>
                </div>
              </div>
            </div>

            {/* User Analytics */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">User Analytics</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cookie Enabled</span>
                  <span className="text-sm font-medium">0</span>
                </div>
              </div>
            </div>

            {/* Content Management */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Content</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('lessons')}
                  className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  📚 Manage Lessons
                </button>
                <button 
                  onClick={() => setActiveTab('calculators')}
                  className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  📊 Manage Calculators
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
                  ⚙️ Site Settings
                </button>
              </div>
            </div>

            {/* Customer Management */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Customer Management</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Passwordless authentication is active. Customers are identified by email only.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-red-600 text-white rounded-lg px-4 py-2.5 sm:py-2 text-sm font-semibold hover:bg-red-700 transition">
                    Export Customer Data
                  </button>
                  <button className="border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 sm:py-2 text-sm font-semibold hover:bg-gray-50 transition">
                    View Customer List
                  </button>
                  <button className="border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 sm:py-2 text-sm font-semibold hover:bg-gray-50 transition">
                    Cookie Analytics
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <LessonManager />
          )}

          {activeTab === 'calculators' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="text-center">
                <div className="text-gray-400 mb-2 text-2xl sm:text-3xl">📊</div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Calculator Management</h2>
                <p className="text-gray-600">Coming soon - manage financial calculators</p>
              </div>
            </div>
          )}

          {activeTab === 'stripe' && (
            <StripeManager />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-sm text-gray-600 mt-2">Administrative access to ZeroFinanx</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="admin@zerofinanx.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <input
                type="password"
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Enter access code"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-red-700 transition"
            >
              Admin Sign In
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Demo Credentials:</p>
              <p className="text-xs text-gray-700">Email: admin@zerofinanx.com</p>
              <p className="text-xs text-gray-700">Code: demo123</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
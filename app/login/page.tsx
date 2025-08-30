'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmailGate from '@/components/EmailGate';
import CalculatorsList from '@/components/CalculatorsList';
import LessonCategoryView from '@/components/LessonCategoryView';
import { isGuestAuthAllowed, getStoredEmail } from '@/lib/cookies';

export default function LoginPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [storedEmail, setStoredEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalculators, setShowCalculators] = useState(false);
  const [showLessons, setShowLessons] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user already has guest authentication
    const guestAllowed = isGuestAuthAllowed();
    const email = getStoredEmail();
    
    if (guestAllowed && email) {
      setIsAuthorized(true);
      setStoredEmail(email);
    }
    
    setIsLoading(false);
  }, []);

  const handleGuestProceed = (email: string) => {
    setIsAuthorized(true);
    setStoredEmail(email);
  };

  const handleExistingUserProceed = (email: string) => {
    // For now, treat as same flow. In production, this could
    // check for existing customer data and provide different UX
    setIsAuthorized(true);
    setStoredEmail(email);
  };

  const handleLogout = () => {
    // For now, just clear the local state
    // In production, you might want to clear the cookie too
    setIsAuthorized(false);
    setStoredEmail(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <EmailGate
        onGuestProceed={handleGuestProceed}
        onExistingUserProceed={handleExistingUserProceed}
      />
    );
  }

  // User is authenticated - show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">ZeroFinanx Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {storedEmail}</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Home
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Welcome Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Welcome to ZeroFinanx</h2>
            <p className="text-gray-600 text-sm mb-4">
              Your financial education journey starts here. Access your courses, calculators, and progress.
            </p>
            <button className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
              Start Learning
            </button>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Progress</h2>
            <p className="text-gray-600 text-sm mb-4">
              Track your financial education journey and see how far you&apos;ve come.
            </p>
            <div className="bg-gray-100 rounded-full h-2 mb-2">
              <div className="bg-gray-900 h-2 rounded-full w-1/4"></div>
            </div>
            <p className="text-xs text-gray-500">25% Complete</p>
          </div>

          {/* Calculators Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Calculators</h2>
            <p className="text-gray-600 text-sm mb-4">
              Access powerful financial calculators to help you make informed decisions.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => setShowCalculators(true)}
                className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                📊 View All Calculators
              </button>
            </div>
          </div>

          {/* Lessons Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Lessons</h2>
            <p className="text-gray-600 text-sm mb-4">
              Learn with educational videos organized by life stage and financial goals.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => setShowLessons(true)}
                className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                📚 View All Lessons
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm md:col-span-2 lg:col-span-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{storedEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <p className="text-sm text-gray-900">Educational Access</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
                <p className="text-sm text-gray-900">None - Educational Content</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Storage</label>
                <p className="text-sm text-gray-600">Passwordless system - email only</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lessons Modal */}
      {showLessons && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Financial Lessons</h2>
                <button
                  onClick={() => setShowLessons(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              <LessonCategoryView 
                className="border-0 shadow-none rounded-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Calculators Modal */}
      {showCalculators && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Financial Calculators</h2>
                <button
                  onClick={() => setShowCalculators(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              <CalculatorsList 
                showHeader={false}
                className="border-0 shadow-none rounded-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
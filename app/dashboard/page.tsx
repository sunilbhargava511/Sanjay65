'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Calculator, MessageSquare, User, LogOut, BookOpen, FileText, Settings } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for passwordless session
    const checkSession = async () => {
      try {
        // Check for passwordless session cookie
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('passwordless-session='));
        
        if (sessionCookie) {
          // Decode JWT to get email (in production, validate on server)
          const token = sessionCookie.split('=')[1];
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserEmail(payload.email);
        } else {
          // Check URL params for immediate redirect from magic link
          const urlParams = new URLSearchParams(window.location.search);
          const fromMagicLink = urlParams.get('from') === 'magic-link';
          
          if (fromMagicLink) {
            // Give cookie time to be set
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            // No session, redirect to login
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'passwordless-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Empty left area */}
          <div className="w-24" aria-hidden="true" />

          {/* Center title */}
          <div className="text-center">
            <h1 className="text-lg font-semibold tracking-tight">zerofinanx</h1>
            <p className="text-xs text-gray-500">Zero Financial Anxiety - Dashboard</p>
          </div>

          {/* Right actions */}
          <div className="flex w-24 items-center justify-end gap-3">
            <span className="text-xs text-gray-600 hidden sm:block">
              {userEmail?.split('@')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12 md:pt-16">
        {/* Welcome Section */}
        <section className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back{userEmail ? `, ${userEmail.split('@')[0]}` : ''}!
          </h2>
          <p className="mt-3 text-gray-600">
            Your journey to Zero Financial Anxiety continues here. Let's build your personalized financial plan.
          </p>
        </section>

        {/* Action Cards Grid */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Start Learning */}
          <button
            onClick={() => router.push('/learn')}
            className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-lg bg-purple-100 p-3 group-hover:bg-purple-200 transition">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold tracking-tight">Start Learning</h3>
                <p className="text-sm text-gray-600">Educational lessons</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Master personal finance fundamentals with bite-sized lessons. Learn at your own pace with U.S.-focused content.
            </p>
            <div className="text-purple-600 font-medium text-sm group-hover:text-purple-700">
              Browse Lessons →
            </div>
          </button>

          {/* Start Calculating */}
          <button
            onClick={() => router.push('/calculator/save-spend')}
            className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-lg bg-blue-100 p-3 group-hover:bg-blue-200 transition">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold tracking-tight">Start Calculating</h3>
                <p className="text-sm text-gray-600">Financial tools</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Calculate your Save Number and Spend Number. Get clear on your optimal savings rate and spending plan.
            </p>
            <div className="text-blue-600 font-medium text-sm group-hover:text-blue-700">
              Open Calculator →
            </div>
          </button>

          {/* Give Feedback */}
          <button
            onClick={() => router.push('/feedback')}
            className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-lg bg-green-100 p-3 group-hover:bg-green-200 transition">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold tracking-tight">Give Feedback</h3>
                <p className="text-sm text-gray-600">Share your thoughts</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Help us improve ZeroFinanx. Suggest topics you'd like us to cover or share general feedback.
            </p>
            <div className="text-green-600 font-medium text-sm group-hover:text-green-700">
              Share Feedback →
            </div>
          </button>
        </section>

        {/* Getting Started Guide */}
        <section className="mt-16 mx-auto max-w-4xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-amber-900">Your Financial Journey</h3>
              <p className="text-sm text-amber-800 mt-1">Follow this simple path to Zero Financial Anxiety</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4 rounded-xl bg-white/50 p-4">
                <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-900">Step 1: Calculate Your Numbers</p>
                  <p className="text-xs text-amber-800">Use the Save/Spend Calculator to understand your financial foundation</p>
                </div>
                <button
                  onClick={() => router.push('/calculator/save-spend')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex-shrink-0"
                >
                  Start →
                </button>
              </div>
              
              <div className="flex items-center gap-4 rounded-xl bg-white/50 p-4">
                <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-900">Step 2: Learn the Fundamentals</p>
                  <p className="text-xs text-amber-800">Master key concepts with our bite-sized educational lessons</p>
                </div>
                <button
                  onClick={() => router.push('/learn')}
                  className="text-xs font-medium text-purple-600 hover:text-purple-700 flex-shrink-0"
                >
                  Learn →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-12 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.push('/user-guide')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <FileText className="h-4 w-4" />
            User Guide
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-600">
          Copyright {new Date().getFullYear()} zerofinanx. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
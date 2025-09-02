'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Calculator, Target, TrendingUp, User, LogOut, Home, FileText, Settings } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for passwordless session
    const checkSession = async () => {
      try {
        console.log('All cookies:', document.cookie);
        
        // Check for passwordless session cookie
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('passwordless-session='));
        
        console.log('Session cookie found:', sessionCookie ? 'Yes' : 'No');
        
        if (sessionCookie) {
          // Decode JWT to get email (in production, validate on server)
          const token = sessionCookie.split('=')[1];
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Session payload:', payload);
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
            console.log('No session found, redirecting to login');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Calculator,
      title: 'Save/Spend Calculator',
      description: 'Calculate your optimal savings rate and spending plan',
      href: '/calculator/save-spend',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Goal Tracker',
      description: 'Set and track your financial goals',
      href: '/goals',
      color: 'bg-green-500'
    },
    {
      icon: Book,
      title: 'Educational Content',
      description: 'Learn personal finance fundamentals',
      href: '/learn',
      color: 'bg-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress Dashboard',
      description: 'Monitor your financial journey',
      href: '/progress',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">ZeroFinanx Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back{userEmail ? `, ${userEmail.split('@')[0]}` : ''}!
          </h2>
          <p className="mt-2 text-gray-600">
            Your journey to Zero Financial Anxiety starts here. Let's build your personalized financial plan.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trial Days Left</p>
                <p className="text-2xl font-bold text-gray-900">30</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <Book className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goals Set</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
              <div className="rounded-lg bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Get Started</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.title}
                  onClick={() => router.push(feature.href)}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:shadow-lg"
                >
                  <div className={`mb-4 inline-flex rounded-lg ${feature.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Start →
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Your Journey</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
              <div className="rounded-full bg-blue-100 p-2">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Welcome to ZeroFinanx!</p>
                <p className="text-sm text-gray-600">Start with the Save/Spend Calculator to understand your numbers</p>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => router.push('/user-guide')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            User Guide
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </main>
    </div>
  );
}
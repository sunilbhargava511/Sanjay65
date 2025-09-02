'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Calculator, User, LogOut, Home, FileText, Settings, MessageSquare, Send, HelpCircle } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

  const features = [
    {
      icon: Calculator,
      title: 'Save/Spend Calculator',
      description: 'Calculate your optimal savings rate and spending plan',
      href: '/calculator/save-spend',
      color: 'bg-blue-500'
    },
    {
      icon: Book,
      title: 'Educational Content',
      description: 'Learn personal finance fundamentals',
      href: '/learn',
      color: 'bg-purple-500'
    }
  ];

  const suggestedTopics = [
    "Save & Spend Numbers",
    "Emergency Fund Planning",
    "Debt Management Strategies",
    "Retirement Savings",
    "Budgeting Basics",
    "Investment vs Debt Payoff"
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to an API
    console.log('Feedback submitted:', feedbackText);
    setFeedbackSubmitted(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSubmitted(false), 3000);
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

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Get Started</h3>
          <div className="grid gap-4 sm:grid-cols-2">
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

        {/* Feedback Area */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Suggested Topics */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Explore Topics</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select a topic you'd like to learn about, then ask your question:</p>
            <div className="space-y-2">
              {suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setFeedbackText(`I have a question about ${topic}: `)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-sm font-medium"
                >
                  <div className="flex items-center justify-between">
                    <span>{topic}</span>
                    <span className="text-gray-400">→</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                💡 <strong>Tip:</strong> Click a topic above, then type your specific question in the feedback box.
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-green-100 p-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Share Your Feedback</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Have questions, suggestions, or need help? Let us know!</p>
            
            {feedbackSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-green-800 font-medium mb-1">Thank you!</div>
                <div className="text-sm text-green-700">Your feedback has been submitted. We'll get back to you soon.</div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Ask a question, share feedback, or tell us what you'd like to learn about..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition"
                >
                  <Send className="h-4 w-4" />
                  Send Feedback
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Your Journey Starts Here</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
              <div className="rounded-full bg-blue-100 p-2">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Step 1: Calculate Your Numbers</p>
                <p className="text-sm text-gray-600">Use the Save/Spend Calculator to understand your financial foundation</p>
              </div>
              <button
                onClick={() => router.push('/calculator/save-spend')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Start →
              </button>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-purple-50 p-4">
              <div className="rounded-full bg-purple-100 p-2">
                <Book className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Step 2: Learn the Fundamentals</p>
                <p className="text-sm text-gray-600">Master key concepts with our bite-sized educational lessons</p>
              </div>
              <button
                onClick={() => router.push('/learn')}
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                Learn →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
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
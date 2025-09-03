'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Send, HelpCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function FeedbackPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [topicSuggestion, setTopicSuggestion] = useState('');
  const [topicSubmitted, setTopicSubmitted] = useState(false);

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
          // No session, redirect to login
          router.push('/login');
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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'feedback',
          content: feedbackText,
          userEmail: userEmail
        }),
      });
      
      if (response.ok) {
        setFeedbackSubmitted(true);
        setFeedbackText('');
        setTimeout(() => setFeedbackSubmitted(false), 5000);
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'topic_suggestion',
          content: topicSuggestion,
          userEmail: userEmail
        }),
      });
      
      if (response.ok) {
        setTopicSubmitted(true);
        setTopicSuggestion('');
        setTimeout(() => setTopicSubmitted(false), 5000);
      } else {
        console.error('Failed to submit topic suggestion');
      }
    } catch (error) {
      console.error('Error submitting topic suggestion:', error);
    }
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
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="text-center">
            <h1 className="text-lg font-semibold tracking-tight">zerofinanx</h1>
            <p className="text-xs text-gray-500">Your Feedback Matters</p>
          </div>

          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-12">
        {/* Page Title */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Share Your Thoughts</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Help us improve ZeroFinanx by sharing your feedback and suggesting topics you'd like us to cover.
          </p>
        </section>

        {/* Feedback Forms Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Topic Suggestions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-purple-100 p-3">
                <HelpCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Suggest New Topics</h3>
                <p className="text-sm text-gray-600">What would you like to learn about?</p>
              </div>
            </div>
            
            {topicSubmitted ? (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-purple-800 font-semibold mb-2">Thank you for your suggestion!</div>
                <div className="text-sm text-purple-700">We'll consider adding this topic to our educational content.</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <textarea
                    value={topicSuggestion}
                    onChange={(e) => setTopicSuggestion(e.target.value)}
                    placeholder="Examples:
• How to negotiate salary increases
• Understanding stock options and RSUs  
• Tax strategies for freelancers
• College savings strategies
• Real estate investment basics
• Healthcare and insurance planning"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
                    required
                  />
                </div>
                <div className="w-full bg-purple-50 border border-purple-200 rounded-xl px-6 py-4 text-center">
                  <p className="text-purple-800 font-semibold mb-2">📧 Send your topic suggestion via email:</p>
                  <a href="mailto:sanjay@tiseed.com" className="text-purple-600 font-medium underline hover:text-purple-700">
                    sanjay@tiseed.com
                  </a>
                </div>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600">
                💡 <strong>Your input matters:</strong> We prioritize creating content based on what our users want to learn.
              </p>
            </div>
          </div>

          {/* General Feedback */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-blue-100 p-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">General Feedback</h3>
                <p className="text-sm text-gray-600">Questions, suggestions, or comments</p>
              </div>
            </div>
            
            {feedbackSubmitted ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-blue-800 font-semibold mb-2">Thank you!</div>
                <div className="text-sm text-blue-700">Your feedback has been submitted. We'll get back to you soon.</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Share your thoughts about ZeroFinanx:

• How can we improve the platform?
• What features would you like to see?
• Any questions about financial planning?
• Technical issues or suggestions?
• General comments or ideas?"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                  />
                </div>
                <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 text-center">
                  <p className="text-blue-800 font-semibold mb-2">📧 Send your feedback via email:</p>
                  <a href="mailto:sanjay@tiseed.com" className="text-blue-600 font-medium underline hover:text-blue-700">
                    sanjay@tiseed.com
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <section className="mt-12 text-center text-sm text-gray-500">
          <p>
            Your feedback helps us create better financial education content. 
            We read every submission and use your input to improve ZeroFinanx.
          </p>
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
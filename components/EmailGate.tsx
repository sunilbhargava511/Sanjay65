'use client';

import React, { useState, useEffect } from 'react';
import { setGuestCookie, getStoredEmail, areCookiesEnabled } from '@/lib/guest-cookie';

interface EmailGateProps {
  onProceed: (email: string) => void;
  onCancel?: () => void;
}

export default function EmailGate({ onProceed, onCancel }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [showBenefits, setShowBenefits] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  useEffect(() => {
    // Check if cookies are enabled
    setCookiesEnabled(areCookiesEnabled());
    
    // Check for stored email
    const storedEmail = getStoredEmail();
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Store email in cookie for future visits
    setGuestCookie({ email, allowed: true });
    setShowBenefits(true);
  };

  const handleProceed = async () => {
    setIsLoading(true);
    
    try {
      onProceed(email);
    } catch (error) {
      console.error('Failed to proceed:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cookiesEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-red-100 text-red-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Cookies Required</h2>
            <p className="text-sm text-slate-600 mb-4">
              This application requires cookies to be enabled for authentication. 
              Please enable cookies in your browser settings and refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-slate-800"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showBenefits) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to ZeroFinanx</h1>
              <p className="text-sm text-gray-600">Your email: <span className="font-medium">{email}</span></p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">🚀 Passwordless Benefits</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• No passwords to remember or manage</li>
                  <li>• Faster access for return visits</li>
                  <li>• Your email automatically saved</li>
                  <li>• Simple and secure experience</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">🔒 Privacy & Security</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Only your email is stored</li>
                  <li>• Data expires automatically after 1 year</li>
                  <li>• You can clear your data anytime</li>
                  <li>• No third-party tracking</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleProceed}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Continue with Passwordless Access'}
              </button>

              {onCancel && (
                <button
                  onClick={onCancel}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 font-semibold hover:bg-gray-50 transition"
                >
                  Use Different Method
                </button>
              )}

              <button
                onClick={() => setShowBenefits(false)}
                className="w-full text-gray-600 hover:text-gray-900 text-sm py-2"
              >
                ← Back to change email
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to ZeroFinanx</h1>
            <p className="text-gray-600">Enter your email to get started</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              No passwords required. We use a secure, passwordless system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
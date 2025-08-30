'use client';

import React, { useState } from 'react';
import { isValidEmail, normalizeEmail, enableGuestAuth } from '@/lib/cookies';

interface EmailGateProps {
  onGuestProceed: (email: string) => void;
  onExistingUserProceed?: (email: string) => void;
}

export default function EmailGate({ onGuestProceed, onExistingUserProceed }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [showBenefits, setShowBenefits] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = normalizeEmail(email);
    
    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setShowBenefits(true);
  };

  const handleGuestProceed = async () => {
    setIsLoading(true);
    const normalizedEmail = normalizeEmail(email);
    
    try {
      // Enable guest authentication
      enableGuestAuth(normalizedEmail);
      onGuestProceed(normalizedEmail);
    } catch (error) {
      console.error('Failed to enable guest auth:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingUserProceed = () => {
    if (onExistingUserProceed) {
      onExistingUserProceed(normalizeEmail(email));
    }
  };

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
                onClick={handleGuestProceed}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Continue to ZeroFinanx'}
              </button>

              {onExistingUserProceed && (
                <button
                  onClick={handleExistingUserProceed}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 font-semibold hover:bg-gray-50 transition"
                >
                  I have existing account access
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
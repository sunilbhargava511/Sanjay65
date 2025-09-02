'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AuthConfig {
  method: 'oauth' | 'passwordless' | 'both';
  passwordless: {
    enabled: boolean;
    emailFrom: string;
    emailServer: string;
  };
  oauth: {
    enabled: boolean;
    google: {
      clientId: string;
      clientSecret: string;
      configured: boolean;
    };
    apple: {
      clientId: string;
      teamId: string;
      privateKey: string;
      keyId: string;
      configured: boolean;
    };
  };
  defaultMethod: 'oauth' | 'passwordless';
}

// Force this page to be dynamic - it needs to make API calls
export const dynamic = 'force-dynamic';

export default function AuthSettingsPage() {
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [authMethod, setAuthMethod] = useState<'oauth' | 'passwordless' | 'both'>('passwordless');
  const [defaultMethod, setDefaultMethod] = useState<'oauth' | 'passwordless'>('passwordless');
  const [emailServer, setEmailServer] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [showEmailServerInput, setShowEmailServerInput] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/auth/config');
      const data = await response.json();
      
      if (response.ok) {
        setConfig(data);
        setAuthMethod(data.method || 'passwordless');
        setDefaultMethod(data.defaultMethod || 'passwordless');
        setEmailFrom(data.passwordless?.emailFrom || 'ZeroFinanx <noreply@zerofinanx.com>');
        setEmailServer(data.passwordless?.emailServer || '');
      } else {
        setMessage({ type: 'error', text: 'Failed to load configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/auth/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: authMethod,
          defaultMethod: defaultMethod,
          passwordless: {
            emailServer: showEmailServerInput ? emailServer : config?.passwordless?.emailServer,
            emailFrom: emailFrom
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Configuration saved successfully' });
        // Reload config to get updated values
        await loadConfig();
        setShowEmailServerInput(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Admin Panel
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Authentication Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure how users authenticate with your application
          </p>
        </div>

        {/* Main Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Method</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Authentication Method
              </label>
              <select
                value={authMethod}
                onChange={(e) => setAuthMethod(e.target.value as 'oauth' | 'passwordless' | 'both')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="passwordless">Passwordless (Magic Link) - Recommended</option>
                <option value="oauth">OAuth Only (Google/Apple)</option>
                <option value="both">Both Methods Available</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {authMethod === 'passwordless' && 'Users will sign in using magic links sent to their email'}
                {authMethod === 'oauth' && 'Users will sign in using Google or Apple accounts only'}
                {authMethod === 'both' && 'Users can choose between magic links or OAuth providers'}
              </p>
            </div>

            {authMethod === 'both' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Method (when both are available)
                </label>
                <select
                  value={defaultMethod}
                  onChange={(e) => setDefaultMethod(e.target.value as 'oauth' | 'passwordless')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="passwordless">Passwordless (Magic Link)</option>
                  <option value="oauth">OAuth (Google/Apple)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  The method that will be shown by default on the login page
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Passwordless Settings */}
        {(authMethod === 'passwordless' || authMethod === 'both') && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Passwordless Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email From Address
                </label>
                <input
                  type="text"
                  value={emailFrom}
                  onChange={(e) => setEmailFrom(e.target.value)}
                  placeholder="ZeroFinanx <noreply@zerofinanx.com>"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The email address that will appear as the sender of magic links
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Server Configuration
                </label>
                {config?.passwordless?.emailServer && !showEmailServerInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="••••••••••••••••"
                      disabled
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 bg-gray-50"
                    />
                    <button
                      onClick={() => setShowEmailServerInput(true)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={emailServer}
                      onChange={(e) => setEmailServer(e.target.value)}
                      placeholder="smtp://username:password@smtp.example.com:587"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {showEmailServerInput && (
                      <button
                        onClick={() => {
                          setShowEmailServerInput(false);
                          setEmailServer('');
                        }}
                        className="mt-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  SMTP server configuration for sending magic link emails
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Passwordless Benefits</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• No passwords for users to remember or manage</li>
                  <li>• Enhanced security - no password breaches</li>
                  <li>• Faster onboarding - users start immediately</li>
                  <li>• Automatic email verification</li>
                  <li>• Return visits are seamless with cookie persistence</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* OAuth Status */}
        {(authMethod === 'oauth' || authMethod === 'both') && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">OAuth Provider Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${config?.oauth?.google?.configured ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">Google OAuth</span>
                </div>
                <span className="text-sm text-gray-600">
                  {config?.oauth?.google?.configured ? 'Configured' : 'Not configured'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${config?.oauth?.apple?.configured ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">Apple OAuth</span>
                </div>
                <span className="text-sm text-gray-600">
                  {config?.oauth?.apple?.configured ? 'Configured' : 'Not configured'}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                To configure OAuth providers, go to <Link href="/admin/oauth" className="text-blue-600 hover:underline">OAuth Settings</Link>
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {message && (
              <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Changes require application restart to take effect</li>
            <li>• Passwordless authentication is recommended for better user experience</li>
            <li>• Email server configuration is required for magic links to work</li>
            <li>• OAuth providers must be configured separately with their respective credentials</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
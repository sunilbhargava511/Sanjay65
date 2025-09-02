'use client';

import { Settings, ArrowLeft, User, Bell, Shield, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get user email from session cookie
    try {
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('passwordless-session='));
      
      if (sessionCookie) {
        const token = sessionCookie.split('=')[1];
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email);
      }
    } catch (error) {
      console.error('Failed to get user email:', error);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'passwordless-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-2">Manage your ZeroFinanx account preferences</p>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Account Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 text-gray-900">{userEmail || 'Loading...'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Account Type</label>
                <div className="mt-1 text-gray-900">Free Education Plan</div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Notification preferences will be available soon.</p>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Authentication Method</h3>
                <p className="text-sm text-gray-600">Magic Link (Passwordless)</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-red-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Billing (Future) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 opacity-50">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Billing</h2>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">No billing information required - your education plan is completely free.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
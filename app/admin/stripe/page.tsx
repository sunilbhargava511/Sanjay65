'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function StripeSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Stripe Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure Stripe for payment processing and subscriptions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Stripe Integration</h2>
            <p className="text-gray-600 mb-6">
              This feature is coming soon. Stripe payment processing and subscription management will be available in a future update.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-green-900 mb-2">What's Coming:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Stripe API key configuration</li>
                <li>• Subscription plan management</li>
                <li>• Payment method setup</li>
                <li>• Webhook configuration</li>
                <li>• Transaction monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
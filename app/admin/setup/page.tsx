'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SetupPage() {
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
          
          <h1 className="text-3xl font-bold text-gray-900">Setup Instructions</h1>
          <p className="text-gray-600 mt-2">
            Step-by-step guide to configure your ZeroFinanx application
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Setup */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Setup Complete</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Your ZeroFinanx application is ready to use with the following features:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Passwordless authentication (magic links)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Lesson management system
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Calculator upload and management
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                User feedback system
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Admin dashboard
              </li>
            </ul>
          </div>

          {/* Optional Configurations */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Optional Configurations</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">OAuth Providers</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Add Google and Apple Sign-In for easier user authentication
                  </p>
                  <Link href="/admin/oauth" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    Configure OAuth →
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-green-900">Payment Processing</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Set up Stripe for subscription management and premium features
                  </p>
                  <Link href="/admin/stripe" className="text-sm text-green-600 hover:text-green-800 mt-2 inline-block">
                    Configure Stripe →
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Analytics Tracking</h3>
                  <p className="text-sm text-purple-700 mt-1">
                    Monitor user engagement and application usage
                  </p>
                  <Link href="/admin/analytics" className="text-sm text-purple-600 hover:text-purple-800 mt-2 inline-block">
                    View Analytics →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">Getting Started</h2>
            <ol className="space-y-2 text-sm text-amber-800">
              <li>1. Add your first lesson in <Link href="/admin/lessons" className="text-amber-900 hover:underline font-medium">Lesson Management</Link></li>
              <li>2. Upload financial calculators in <Link href="/admin/calculators" className="text-amber-900 hover:underline font-medium">Calculator Management</Link></li>
              <li>3. Test the user experience by visiting the <Link href="/" className="text-amber-900 hover:underline font-medium">main site</Link></li>
              <li>4. Monitor user feedback in <Link href="/admin/feedback" className="text-amber-900 hover:underline font-medium">User Feedback</Link></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
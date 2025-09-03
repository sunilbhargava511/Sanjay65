'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Monitor user activity and application performance
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center mb-8">
          <div className="w-16 h-16 bg-rose-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-rose-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Comprehensive analytics and reporting features are coming soon.
          </p>
        </div>

        {/* Planned Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">User Analytics</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Active users tracking</li>
              <li>• Registration metrics</li>
              <li>• User engagement rates</li>
              <li>• Session duration analysis</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Content Performance</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Most popular lessons</li>
              <li>• Calculator usage stats</li>
              <li>• Completion rates</li>
              <li>• Content engagement</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">System Metrics</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Page load times</li>
              <li>• Error rates</li>
              <li>• API performance</li>
              <li>• System health status</li>
            </ul>
          </div>
        </div>

        {/* Current Basic Stats */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Current Status</h3>
          <p className="text-sm text-blue-700 mb-4">
            While comprehensive analytics are in development, you can monitor basic application activity through:
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <div>• <Link href="/admin/lessons" className="text-blue-900 hover:underline font-medium">Lesson Management</Link> - View lesson engagement</div>
            <div>• <Link href="/admin/calculators" className="text-blue-900 hover:underline font-medium">Calculator Management</Link> - Monitor calculator usage</div>
            <div>• <Link href="/admin/feedback" className="text-blue-900 hover:underline font-medium">User Feedback</Link> - Review user suggestions and feedback</div>
          </div>
        </div>
      </div>
    </div>
  );
}
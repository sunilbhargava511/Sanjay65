'use client';

import { TrendingUp, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProgressDashboard() {
  const router = useRouter();

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
            <h1 className="text-xl font-semibold">Progress Dashboard</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Progress Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Monitor your financial journey with visual progress tracking, milestone celebrations, and trend analysis.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-orange-900 mb-2">Coming Soon</h2>
            <p className="text-orange-800 mb-4">
              We're building detailed progress tracking with charts, milestones, and personalized insights.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 bg-orange-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-orange-700 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
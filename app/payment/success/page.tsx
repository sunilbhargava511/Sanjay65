'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, you'd verify the session on the server
    // For now, we'll just show a success message
    setLoading(false);
    setSessionDetails({ success: true });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Mobile Optimized */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-semibold truncate">ZeroFinanx</h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Zero Financial Anxiety - USA</p>
          </div>
          <a
            href="/"
            className="inline-flex items-center rounded-lg border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 hover:bg-gray-50 whitespace-nowrap ml-4"
          >
            Home
          </a>
        </div>
      </header>

      {/* Success Content - Mobile Optimized */}
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-16 text-center">
        <div className="mb-6 sm:mb-8">
          <CheckCircle className="w-12 sm:w-16 h-12 sm:h-16 text-green-500 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Payment Successful!</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Welcome to ZeroFinanx! Your subscription to the Education plan is now active.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Access Your Dashboard</h3>
                <p className="text-sm text-gray-600">Login to access your financial education materials and calculators.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Start Learning</h3>
                <p className="text-sm text-gray-600">Begin with the Save/Spend number calculator and bite-sized lessons.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Get Support</h3>
                <p className="text-sm text-gray-600">Email-only support is included with your education plan.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Access Dashboard
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-gray-300 rounded-xl px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            Back to Home
          </a>
        </div>

        {sessionId && (
          <div className="mt-8 text-xs text-gray-500">
            Session ID: {sessionId}
          </div>
        )}
      </main>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
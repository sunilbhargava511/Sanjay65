'use client';

import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancel() {
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

      {/* Cancel Content - Mobile Optimized */}
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-16 text-center">
        <div className="mb-6 sm:mb-8">
          <XCircle className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Payment Cancelled</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happened?</h2>
          <p className="text-gray-600 mb-6">
            The payment process was interrupted. This could be because you closed the payment window, 
            clicked the back button, or decided not to complete the purchase at this time.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 Want to try again?</h3>
            <p className="text-sm text-blue-800">
              You can return to our pricing page and restart the payment process whenever you're ready. 
              Your subscription will begin immediately after successful payment.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center border border-gray-300 rounded-xl px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue as Guest
          </a>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-2">
            Need help? We're here for you.
          </p>
          <p className="text-xs text-gray-400">
            If you experienced any issues during checkout, feel free to try again or contact support.
          </p>
        </div>
      </main>
    </div>
  );
}
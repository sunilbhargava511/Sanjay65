import React from "react";
import Link from "next/link";
import StartTrialButton from "../../components/StartTrialButton";

export default async function PaywallPage() {
  // TODO: If you have a DB, check if user has active subscription here.
  // If not authenticated, you can show a link back to /login.
  // For simplicity, we just show the paywall box.

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Start your 30‑day free trial</h1>
        <p className="mt-2 text-slate-600 text-sm">
          Enter your payment details on the next screen. You won't be charged until day 31.
        </p>
        <div className="mt-5">
          <StartTrialButton />
        </div>
        <p className="mt-4 text-xs text-slate-500">
          By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>. No refunds after the trial ends, except as required by law.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Not signed in? <Link href="/login" className="underline">Go back to login</Link>.
        </p>
      </div>
    </main>
  );
}
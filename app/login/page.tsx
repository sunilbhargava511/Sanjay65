"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { getStoredEmail, setGuestCookie } from '@/lib/guest-cookie';

export default function EmailCollectionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Check if user already provided email - if so, redirect to content
    const storedEmail = getStoredEmail();
    if (storedEmail) {
      router.push('/dashboard');
      return;
    }
  }, [router]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!accepted) {
      setMessage("Please agree to the Terms & Privacy to continue.");
      return;
    }
    
    if (!email) {
      setMessage("Please enter your email to continue.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Store email in cookie
      setGuestCookie({ email, allowed: true });
      
      // Show success and redirect
      setMessage("Great! Welcome to ZeroFinanx. Redirecting you to the app...");
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:opacity-80">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>

        <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-900 text-white font-bold">Z</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Welcome to ZeroFinanx</h1>
            <p className="mt-1 text-sm text-slate-600">
              Get started with our free financial education tools and calculators.
            </p>
          </div>

          <label className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300"
              aria-label="Agree to Terms & Privacy"
            />
            <span className="text-sm text-slate-700">
              I agree to the <Link href="/terms" className="underline">Terms & Conditions</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
              <br />
              <span className="text-xs text-slate-500">Required to continue.</span>
            </span>
          </label>

          <form onSubmit={handleEmailSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <button
              type="submit"
              disabled={!accepted || isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {isSubmitting ? 'Getting Started...' : 'Get Started'}
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700">
              {message}
            </div>
          )}

          <div className="mt-6 text-xs text-slate-500 space-y-2">
            <p>
              ZeroFinanx provides education only. Not investment, tax, or legal advice. 
              Jurisdiction: Mumbai, Maharashtra, India.
            </p>
            <p>
              We only collect your email for essential communications. We never sell or share it. 
              Please whitelist <span className="font-mono">support@zerofinanx.com</span> for important updates.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ZeroFinanx. Educational content only.
        </p>
      </div>
    </main>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import AfterLoginDashboard from '@/components/AfterLoginDashboard';
import EmailGate from '@/components/EmailGate';
import { getStoredEmail, setGuestCookie } from '@/lib/guest-cookie';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [authMethod, setAuthMethod] = useState<'passwordless' | 'oauth' | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check stored email from cookie
    const storedEmail = getStoredEmail();
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Determine auth method based on configuration
    const defaultMethod = process.env.NEXT_PUBLIC_AUTH_DEFAULT_METHOD || 'passwordless';
    const authConfig = process.env.NEXT_PUBLIC_AUTH_METHOD || 'passwordless';
    
    if (authConfig === 'passwordless') {
      setAuthMethod('passwordless');
    } else if (authConfig === 'oauth') {
      setAuthMethod('oauth');
    } else {
      // Both methods available, use default
      setAuthMethod(defaultMethod as 'passwordless' | 'oauth');
    }
    setLoading(false);
  }, []);

  // If user is authenticated, show dashboard
  if (status === "authenticated" && session) {
    return <AfterLoginDashboard />;
  }

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  function mustAccept() {
    if (!accepted) {
      setMessage("Please agree to the Terms & Privacy to continue.");
      return false;
    }
    setMessage(null);
    return true;
  }

  async function handleOAuth(provider: "google" | "apple") {
    if (!mustAccept()) return;
    setIsSubmitting(true);
    try {
      await signIn(provider, { callbackUrl: "/paywall" });
    } catch (e) {
      setMessage("Couldn't start sign-in. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function handleMagicLink(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!mustAccept()) return;
    if (!email) {
      setMessage("Please enter your email to receive a magic link.");
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      // Store email in cookie for future visits
      setGuestCookie({ email, allowed: true });
      
      // Send magic link
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Check your inbox for a sign-in link from ZeroFinanx. The link will expire in 15 minutes.");
      } else {
        setMessage(data.error || "Couldn't send a magic link. Please try again.");
      }
    } catch (err) {
      setMessage("Couldn't send a magic link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEmailGateProceed(userEmail: string) {
    setEmail(userEmail);
    setShowEmailGate(false);
    setAccepted(true);
    handleMagicLink();
  }

  function handleEmailGateCancel() {
    setShowEmailGate(false);
    setAuthMethod('oauth');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:opacity-80">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>

        <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-900 text-white font-bold">Z</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Sign in to ZeroFinanx</h1>
            <p className="mt-1 text-sm text-slate-600">Passwordless access. Education only. 30‑day free trial, then paid.</p>
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
              <span className="text-xs text-slate-500">You must accept before continuing.</span>
            </span>
          </label>

          <div className="grid gap-3">
            <button
              onClick={() => handleOAuth("google")}
              disabled={!accepted || isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
              aria-label="Continue with Google"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.605 32.91 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.957 3.043l5.657-5.657C34.869 6.05 29.702 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.48 16.19 18.865 12 24 12c3.059 0 5.842 1.156 7.957 3.043l5.657-5.657C34.869 6.05 29.702 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.404-5.196l-6.197-5.238C29.106 35.229 26.715 36 24 36c-5.202 0-9.573-3.064-11.289-7.437l-6.54 5.038C9.476 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.357 3.091-4.738 5.917-11.303 5.917-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.957 3.043l5.657-5.657C34.869 6.05 29.702 4 24 4c-11.045 0-20 8.955-20 20s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/></svg>
                Continue with Google
              </span>
            </button>
            <button
              onClick={() => handleOAuth("apple")}
              disabled={!accepted || isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
              aria-label="Continue with Apple"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-black"><path d="M16.365 1.43c.27 1.955-1.153 3.97-2.894 3.91-.34-1.67 1.33-3.94 2.894-3.91zM20.5 17.46c-.52 1.2-1.16 2.28-1.93 3.24-.98 1.2-2.145 2.7-3.705 2.71-1.405.01-1.855-.88-3.45-.88-1.595 0-2.095.86-3.465.89-1.52.03-2.677-1.3-3.66-2.49C2.355 18.81.88 15.02 2.65 11.8c.995-1.81 2.77-2.95 4.72-2.98 1.47-.03 2.86.99 3.45.99.58 0 2.37-1.23 3.99-1.05.68.03 2.6.28 3.83 2.11-.1.06-2.285 1.33-2.26 3.97.03 3.15 2.79 4.2 3.12 4.62z"/></svg>
                Continue with Apple
              </span>
            </button>
          </div>

{process.env.NEXT_PUBLIC_EMAIL_ENABLED && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-500">or sign in with email</span>
                </div>
              </div>

              <form onSubmit={handleMagicLink} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
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
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
                >
                  Email me a magic link
                </button>
              </form>
            </>
          )}

          {message && (
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700">
              {message}
            </div>
          )}

          <div className="mt-6 text-xs text-slate-500 space-y-2">
            <p>
              30‑day free trial starts today. You won't be charged until day 31. Cancel any time before the trial ends to avoid charges. <strong>No refunds after the trial ends</strong>, except as required by law.
            </p>
            <p>
              ZeroFinanx provides education only. Not investment, tax, or legal advice. Jurisdiction: Mumbai, Maharashtra, India.
            </p>
            <p>
              We only collect your email for login and essential messages. We never sell or share it. Please whitelist <span className="font-mono">support@zerofinanx.com</span> so you don't miss important updates.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} ZeroFinanx. Educational content only.</p>
      </div>
    </main>
  );
}
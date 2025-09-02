'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

// Pricing-only homepage for zerofinanx.com (USA)
// Notes for developer:
// - Remove any voice/TTS blocks entirely.
// - Keep this as the root ("/") page. Only two primary actions: Login and (footer) Admin Login.
// - Replace href="#login" with your actual auth route (e.g., /login, /api/auth/signin, etc.).
// - Replace href="/admin/login" with your admin-auth route. Same user pool; grant admin role via claims/roles.
// - No left-top logo block; minimal header.
// - No "Powered by AI" text anywhere.
// - Tailwind assumed; tweak tokens to your design system.

const featuresByPlan = {
  Essential: [
    "AI guidance - U.S. focused",
    "Interactive lessons & checklists",
    "Core calculators (Save/Spend number, Emergency fund)",
    "Email-only support",
  ],
  Plus: [
    "Everything in Essential",
    "Deeper U.S. tax & benefits modules",
    "Goal tracking & progress history",
    "Priority email support",
  ],
  Pro: [
    "Everything in Plus",
    "Personalized plan export (PDF)",
    "Data import (CSV) & bulk edits",
    "Early access to new calculators",
  ],
};

function PricingCard({
  name,
  priceMonthly,
  priceYearly,
  blurb,
  highlight = false,
  onLoginHref = "/login",
  ctaLabel = "Login to get started",
  disabled = false,
  priceLabel,
  showToggle = true,
  badge,
}) {
  const [annual, setAnnual] = useState(true);
  const price = annual ? priceYearly : priceMonthly;
  const suffix = annual ? "/yr" : "/mo";

  return (
    <div
      className={
        "relative flex flex-col justify-between rounded-2xl border shadow-sm p-6 md:p-8 bg-white " +
        (highlight ? "border-gray-900 shadow-lg" : "border-gray-200")
      }
    >
      {(highlight || badge) && (
        <div className="absolute -top-3 right-6 select-none rounded-full bg-black px-3 py-1 text-xs font-medium text-white">{badge || 'Popular'}</div>
      )}
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
        <p className="mt-2 text-sm text-gray-600">{blurb}</p>
        <div className="mt-6 flex items-end gap-2">
          <span className="text-4xl font-bold tracking-tight">{priceLabel ? priceLabel : `$${price.toLocaleString()}`}</span>
          {!priceLabel && <span className="mb-1 text-sm text-gray-600">{suffix}</span>}
        </div>
        <ul className="mt-6 space-y-2 text-sm">
          {(featuresByPlan[name] || []).map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-gray-900" />
              <span className="text-gray-800">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={onLoginHref}
        aria-disabled={disabled ? "true" : undefined}
        className={
          "mt-8 inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition active:scale-[0.98] " +
          (highlight
            ? "bg-gray-900 text-white border-gray-900 hover:opacity-90"
            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50") +
          (disabled ? " opacity-60 pointer-events-none" : "")
        }
      >
        {ctaLabel}
      </a>

      {showToggle && (
        <div className="mt-4 text-right text-xs text-gray-500">
          <button
            onClick={() => setAnnual((v) => !v)}
            className="underline underline-offset-2 hover:no-underline"
            aria-label="Toggle monthly/annual pricing"
          >
            Switch to {annual ? "Monthly" : "Annual"}
          </button>
        </div>
      )}
    </div>
  );
}

function RoadmapCard({ name, priceLabel, blurb, badge = "Roadmap", footnote, ctaLabel = "Coming soon" }) {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="absolute -top-3 right-6 select-none rounded-full bg-black px-3 py-1 text-xs font-medium text-white">{badge}</div>
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
        <p className="mt-2 text-sm text-gray-600">{blurb}</p>
        {priceLabel && (
          <div className="mt-6 flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tight">{priceLabel}</span>
          </div>
        )}
      </div>
      <a
        href="#"
        aria-disabled="true"
        className="mt-8 inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 opacity-60 pointer-events-none"
      >
        {ctaLabel}
      </a>
      <p className="mt-3 text-xs text-gray-500 min-h-5">{footnote || ' '}</p>
    </div>
  );
}

export default function ZeroFinanxPricingPage() {
  const router = useRouter();
  const [showBio, setShowBio] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [showBetaTerms, setShowBetaTerms] = useState(false);

  // Check for existing session on page load
  useEffect(() => {
    const checkSession = () => {
      try {
        // Check for passwordless session cookie
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('passwordless-session='));
        
        if (sessionCookie) {
          // User is already authenticated, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        // If there's any error, just continue showing the home page
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header (no left-top block) */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Empty left area on purpose */}
          <div className="w-24" aria-hidden="true" />

          {/* Center title */}
          <div className="text-center">
            <h1 className="text-lg font-semibold tracking-tight">zerofinanx</h1>
            <p className="text-xs text-gray-500">Zero Financial Anxiety - USA</p>
          </div>

          {/* Right actions */}
          <nav className="flex w-24 justify-end">
            <a
              href="/login"
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12 md:pt-16">
        {/* Educator video */}
        <section className="mx-auto max-w-4xl text-center">
          <div className="text-xs uppercase tracking-wide text-gray-500">Message from your Chief Personal Finance Educator{" "}<button type="button" onClick={() => setShowBio(true)} className="font-medium text-gray-900 underline underline-offset-2 hover:no-underline">Sanjay Bhargava</button></div>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowBio(true)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Read Sanjay&apos;s 30-second message
            </button>
          </div>
        </section>

        {/* Captions under video */}
        <section className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">Save Number - Spend Number - Next Two Actions</div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">U.S.-focused - No sales calls</div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">Education, not advice – 30-day free trial → $100 one-time</div>
        </section>

        {/* Philosophy strip */}
        <section className="mx-auto mt-6 max-w-4xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center text-sm text-amber-900">
            <span className="font-semibold">Our philosophy:</span> We aim to <span className="font-semibold">get fired</span> as your financial educator—by empowering you to be your own.
            <button type="button" onClick={() => setShowPhilosophy(true)} className="ml-2 underline underline-offset-2">Learn why</button>
          </div>
        </section>

        {/* Offerings hero */}
        <section className="mx-auto max-w-3xl text-center mt-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Offerings & Pricing</h2>
          <p className="mt-3 text-gray-600">
            Educational guidance for U.S. money choices. No ads. No upsells.
          </p>
        </section>

        {/* Pricing grid */}
        <section className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2">
          <div>
            <PricingCard
              name="Education (Beta)"
              priceLabel="Free 30 days"
              blurb="Then $100 one-time. Bite-sized lessons and calculators (Save/Spend Numbers). U.S.-focused. No sales calls."
              highlight
              ctaLabel="Start Free Trial"
              showToggle={false}
              badge="Limited Beta — 100 spots"
            />
            <div className="mt-2 text-xs text-gray-500">
              <button type="button" onClick={() => setShowBetaTerms(true)} className="underline underline-offset-2 hover:no-underline">Beta Terms</button>
            </div>
          </div>

          <div>
            <PricingCard
              name="Internet Advice - Customized ZeroFinanx AI + Email"
              priceMonthly={100}
              priceYearly={1000}
              blurb="100/1000 internet advice customized by ZeroFinanx AI with email interaction."
              ctaLabel="Q1 2026"
              disabled
              showToggle={false}
              badge="Roadmap"
            />
            <p className="mt-3 text-xs text-gray-500">Will require 203(e) SEC registration.</p>
          </div>

          <RoadmapCard
            name="Full-Service Advice - Human + AI (Simplification Focus)"
            priceLabel="$5,000 onboarding + $1,000/mo"
            blurb="Full-service advice combining human expertise and AI. Focus on simplification."
            badge="Planned"
            footnote="Will require full SEC registration."
            ctaLabel="Q2 2026"
          />

          <RoadmapCard
            name="Full-Service + Concierge - Human + AI"
            priceLabel="$25,000/yr or $3,000/mo"
            blurb="Full-service human + AI advisory including concierge support for complex products."
            badge="Planned"
            footnote=""
            ctaLabel="Q1 2027"
          />
        </section>

        {/* Legal + Admin */}
        <section className="mt-12 text-center text-xs text-gray-500">
          <p>
            zerofinanx provides educational content and tools. It is <span className="font-semibold">not</span> investment, legal, tax, or accounting advice. Consult a qualified professional before acting.
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <a href="/user-guide" className="underline underline-offset-2 hover:no-underline">User Guide</a>
            <a href="/admin/login" className="underline underline-offset-2 hover:no-underline">Admin Login</a>
            <button type="button" onClick={() => setShowBetaTerms(true)} className="underline underline-offset-2 hover:no-underline">Beta Terms</button>
          </div>
        </section>
      </main>

      {/* Bio modal */}
      {showBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowBio(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bio-title"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 id="bio-title" className="text-lg font-semibold tracking-tight">Sanjay Bhargava</h3>
            <p className="mt-2 text-sm text-gray-700">40+ years in finance—Citibank and PayPal&apos;s founding team. Our philosophy is simple: we aim to get fired as your financial educator by empowering you to be your own.</p>
            <p className="mt-3 text-sm text-gray-700">You&apos;ll get bite-sized, U.S.-focused lessons and calculators, updated every two weeks based on your feedback.</p>
            <p className="mt-3 text-sm text-gray-700">The same customer- and AI-centric philosophy will hold once we can give advice and our SEC registration is effective. This is education, not advice. Click Login to get started.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowBio(false)}
                className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Philosophy modal */}
      {showPhilosophy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPhilosophy(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-labelledby="philosophy-title" className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="philosophy-title" className="text-lg font-semibold tracking-tight">Why we want to be fired</h3>
            <p className="mt-2 text-sm text-gray-700">ZeroFinanx is built to transfer skill, not create dependence. Our goal is to teach a simple, U.S.-focused playbook so you can make confident decisions yourself. Use our lessons and calculators to build your plan - and when you&apos;re ready, fire us.</p>
            <p className="mt-3 text-sm text-gray-700">The same customer- and AI-centric philosophy will hold once we can give advice and our SEC registration is effective.</p>
            <p className="mt-3 text-xs text-gray-500">Educational service. Not investment, legal, tax, or accounting advice. Consult a qualified professional before acting.</p>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setShowPhilosophy(false)} className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Beta Terms modal */}
      {showBetaTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBetaTerms(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-labelledby="beta-title" className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="beta-title" className="text-lg font-semibold tracking-tight">Beta Terms</h3>
            <ul className="mt-2 space-y-2 list-disc pl-5 text-sm text-gray-700">
              <li><span className="font-medium">30-day free trial.</span> Your card is not charged until the trial ends.</li>
              <li>Cancel any time in the first 30 days to pay $0.</li>
              <li>After the trial ends and your card is charged, <span className="font-medium">no refunds</span>.</li>
              <li>Each Beta user will receive <span className="font-medium">$200</span> in cash if ZeroFinanx exits Beta and total revenue exceeds <span className="font-medium">$100,000</span>.</li>
            </ul>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setShowBetaTerms(false)} className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-600">
          Copyright {new Date().getFullYear()} zerofinanx. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
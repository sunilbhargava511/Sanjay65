import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  // For now, we'll handle checkout without session validation
  // In a real app, you'd want to get the email from the authenticated session
  const email = undefined; // Will be filled by user during Stripe checkout

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  if (!process.env.STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 500 });
  }
  if (!process.env.APP_BASE_URL) {
    return NextResponse.json({ error: "Missing APP_BASE_URL" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.APP_BASE_URL}/login`, // Redirect to our dashboard
      cancel_url: `${process.env.APP_BASE_URL}/paywall`,
      customer_email: email,
      allow_promotion_codes: false,
      subscription_data: {
        trial_period_days: 30,
        metadata: email ? { email } : undefined,
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err: any) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: "Checkout error" }, { status: 500 });
  }
}
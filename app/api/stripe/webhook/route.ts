import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  const sig = (await headers()).get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed":
      console.log("Trial started for customer:", event.data.object.customer_email);
      // TODO: Mark user as 'trialing' in DB
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      console.log("Subscription status changed:", event.data.object.status);
      // TODO: Mark user active/canceled based on status
      break;
    case "customer.subscription.deleted":
      console.log("Subscription canceled:", event.data.object.customer);
      // TODO: Mark user inactive
      break;
    default:
      console.log("Unhandled webhook event:", event.type);
      break;
  }

  return NextResponse.json({ received: true });
}
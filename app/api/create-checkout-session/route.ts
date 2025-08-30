import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { planType, billingInterval, email } = await request.json();

    // Define pricing based on plan and interval
    let amount: number;
    let productName: string;
    let intervalStr: string;

    switch (planType) {
      case 'education':
        if (billingInterval === 'yearly') {
          amount = 10000; // $100.00
          productName = 'ZeroFinanx Education Plan - Annual';
          intervalStr = 'year';
        } else {
          amount = 1000; // $10.00  
          productName = 'ZeroFinanx Education Plan - Monthly';
          intervalStr = 'month';
        }
        break;
      default:
        throw new Error('Invalid plan type');
    }

    // Get the base URL for redirect URLs
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : 'https://zerofinanx-website-4v1gdyzum-sunils-projects-7b08a1e8.vercel.app';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: 'Bite-sized lessons and calculators (Save/Spend Numbers). U.S.-focused. No sales calls.',
            },
            unit_amount: amount,
            recurring: {
              interval: intervalStr as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      automatic_payment_methods: {
        enabled: true,
      },
      customer_email: email,
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel`,
      billing_address_collection: 'auto',
      metadata: {
        planType,
        billingInterval,
        email: email || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
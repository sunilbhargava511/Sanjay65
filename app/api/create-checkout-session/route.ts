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

    // Get the base URL for redirect URLs with robust URL construction
    let baseUrl = 'http://localhost:3000'; // Default fallback
    
    // First try NEXTAUTH_URL (our configured base URL)
    if (process.env.NEXTAUTH_URL) {
      baseUrl = process.env.NEXTAUTH_URL.trim();
      // Clean any duplicate protocols
      if (baseUrl.startsWith('https://https://') || baseUrl.startsWith('http://https://')) {
        baseUrl = baseUrl.replace(/^https?:\/\//, '');
      }
      // Ensure it starts with protocol
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`;
      }
    }
    // Fallback to VERCEL_URL if available  
    else if (process.env.VERCEL_URL) {
      const vercelUrl = process.env.VERCEL_URL.trim();
      baseUrl = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
    }
    // Development fallback
    else if (process.env.NODE_ENV === 'development') {
      baseUrl = 'http://localhost:3003'; // Match our current dev port
    }

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
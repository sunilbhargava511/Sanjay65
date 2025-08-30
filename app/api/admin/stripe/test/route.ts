import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secretKey } = body;

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Secret key is required' },
        { status: 400 }
      );
    }

    // Validate key format
    if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
      return NextResponse.json(
        { error: 'Invalid secret key format' },
        { status: 400 }
      );
    }

    // Test the Stripe connection
    try {
      const stripe = new Stripe(secretKey, {
        apiVersion: '2024-06-20',
      });

      // Make a simple API call to test the key
      const account = await stripe.accounts.retrieve();

      return NextResponse.json({
        success: true,
        account: {
          id: account.id,
          country: account.country,
          default_currency: account.default_currency,
          business_type: account.business_type,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled
        },
        mode: secretKey.startsWith('sk_test_') ? 'test' : 'live'
      });

    } catch (stripeError: any) {
      console.error('Stripe connection test failed:', stripeError);
      
      return NextResponse.json(
        { 
          success: false, 
          error: stripeError.message || 'Failed to connect to Stripe' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error testing Stripe connection:', error);
    return NextResponse.json(
      { error: 'Failed to test connection' },
      { status: 500 }
    );
  }
}
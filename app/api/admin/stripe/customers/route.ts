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

export async function GET(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const startingAfter = searchParams.get('starting_after') || undefined;

    // Get customers from Stripe
    const customers = await stripe.customers.list({
      limit,
      starting_after: startingAfter,
      expand: ['data.subscriptions'],
    });

    // Get additional subscription details for each customer
    const customersWithDetails = await Promise.all(
      customers.data.map(async (customer) => {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 10,
        });

        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: customer.created,
          subscriptions: subscriptions.data.map(sub => ({
            id: sub.id,
            status: sub.status,
            current_period_end: sub.current_period_end,
            current_period_start: sub.current_period_start,
            plan: sub.items.data[0]?.price.nickname || 'Education Plan',
            amount: sub.items.data[0]?.price.unit_amount,
            currency: sub.items.data[0]?.price.currency,
            interval: sub.items.data[0]?.price.recurring?.interval,
          })),
        };
      })
    );

    return NextResponse.json({
      customers: customersWithDetails,
      has_more: customers.has_more,
      total_count: customers.data.length
    });

  } catch (error) {
    console.error('Error fetching Stripe customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
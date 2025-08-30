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
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - (days * 24 * 60 * 60);

    // Get payments/charges
    const charges = await stripe.charges.list({
      created: {
        gte: startDate,
        lte: endDate,
      },
      limit: 100,
    });

    // Get subscriptions
    const subscriptions = await stripe.subscriptions.list({
      created: {
        gte: startDate,
        lte: endDate,
      },
      limit: 100,
    });

    // Calculate analytics
    const totalRevenue = charges.data
      .filter(charge => charge.paid && charge.status === 'succeeded')
      .reduce((sum, charge) => sum + charge.amount, 0);

    const successfulPayments = charges.data.filter(
      charge => charge.paid && charge.status === 'succeeded'
    ).length;

    const failedPayments = charges.data.filter(
      charge => charge.status === 'failed'
    ).length;

    const activeSubscriptions = subscriptions.data.filter(
      sub => sub.status === 'active'
    ).length;

    const cancelledSubscriptions = subscriptions.data.filter(
      sub => sub.status === 'canceled'
    ).length;

    // Monthly recurring revenue calculation
    const activeSubsList = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
    });

    const mrr = activeSubsList.data.reduce((sum, sub) => {
      const priceAmount = sub.items.data[0]?.price.unit_amount || 0;
      const interval = sub.items.data[0]?.price.recurring?.interval;
      
      // Convert to monthly amount
      let monthlyAmount = priceAmount;
      if (interval === 'year') {
        monthlyAmount = priceAmount / 12;
      }
      
      return sum + monthlyAmount;
    }, 0);

    // Payment method breakdown
    const paymentMethods = charges.data
      .filter(charge => charge.paid && charge.status === 'succeeded')
      .reduce((acc: any, charge) => {
        const method = charge.payment_method_details?.type || 'unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {});

    return NextResponse.json({
      period: `${days} days`,
      revenue: {
        total: totalRevenue,
        currency: 'usd',
        formatted: `$${(totalRevenue / 100).toLocaleString()}`
      },
      payments: {
        successful: successfulPayments,
        failed: failedPayments,
        total: successfulPayments + failedPayments,
        success_rate: successfulPayments + failedPayments > 0 
          ? ((successfulPayments / (successfulPayments + failedPayments)) * 100).toFixed(1)
          : '0'
      },
      subscriptions: {
        new: subscriptions.data.length,
        active: activeSubscriptions,
        cancelled: cancelledSubscriptions,
        mrr: {
          amount: mrr,
          formatted: `$${(mrr / 100).toLocaleString()}/month`
        }
      },
      payment_methods: paymentMethods,
      stripe_fees_estimate: {
        amount: Math.round(totalRevenue * 0.029 + (successfulPayments * 30)),
        formatted: `$${((totalRevenue * 0.029 + (successfulPayments * 30)) / 100).toFixed(2)}`
      }
    });

  } catch (error) {
    console.error('Error fetching Stripe analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
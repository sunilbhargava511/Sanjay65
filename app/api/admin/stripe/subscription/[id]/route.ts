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

// Cancel a subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stripe = getStripe();
    const subscriptionId = params.id;

    const subscription = await stripe.subscriptions.cancel(subscriptionId, {
      invoice_now: false,
      prorate: false,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        canceled_at: subscription.canceled_at,
        current_period_end: subscription.current_period_end,
      }
    });

  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

// Update a subscription (pause, resume, change plan)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stripe = getStripe();
    const subscriptionId = params.id;
    const { action, pause_until } = await request.json();

    let updatedSubscription;

    switch (action) {
      case 'pause':
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          pause_collection: {
            behavior: 'void',
            resumes_at: pause_until ? Math.floor(new Date(pause_until).getTime() / 1000) : undefined,
          },
        });
        break;

      case 'resume':
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          pause_collection: null,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "pause" or "resume"' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        pause_collection: updatedSubscription.pause_collection,
        current_period_end: updatedSubscription.current_period_end,
      }
    });

  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
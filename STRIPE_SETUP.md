# Stripe Payment Integration Setup

Your ZeroFinanx website now has Stripe payments integrated! Here's how to set it up:

## 🚀 Quick Setup

### 1. Get Your Stripe Keys

1. Create a Stripe account at https://dashboard.stripe.com
2. Navigate to **Developers > API keys**
3. Copy your **Test keys** (for development):
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2. Configure Environment Variables

Update the `.env.local` file with your actual Stripe keys:

```env
# Test/Development Keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Enable Payment Methods in Stripe

1. Go to **Stripe Dashboard > Settings > Payment methods**
2. Enable the payment methods you want:
   - ✅ Cards (Visa, Mastercard, Amex)
   - ✅ Apple Pay / Google Pay
   - ✅ Link (Stripe's one-click checkout)
   - ✅ Buy now, pay later (Klarna, Afterpay)
   - ✅ ACH Direct Debit
   - ✅ Local payment methods

### 4. Set Up Webhooks (Recommended for Production)

1. Go to **Stripe Dashboard > Developers > Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add it to your `.env.local`

## 📋 Current Implementation

### What's Working
- ✅ Subscription payments for Education plan ($10/month or $100/year)
- ✅ Automatic payment method detection (cards, wallets, BNPL)
- ✅ Mobile-optimized checkout
- ✅ Success and cancel pages
- ✅ Webhook handling for subscription events
- ✅ Loading states and error handling

### Payment Flow
1. User clicks "Start for $X" on Education plan
2. Stripe Checkout opens with all enabled payment methods
3. User completes payment
4. Redirected to success page
5. Webhook confirms subscription creation

## 🧪 Testing

### Test Cards
Use these test card numbers in development:

- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`
- **Requires 3D Secure**: `4000002500003155`

### Testing the Flow
1. Make sure your `.env.local` has test keys
2. Run `npm run dev`
3. Go to homepage and click "Start for $10/month" on Education plan
4. Use test card numbers to complete payment
5. Check Stripe Dashboard > Payments to see test transactions

## 🚀 Going Live

### 1. Switch to Live Keys
Replace test keys with live keys in `.env.local`:
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

### 2. Set Up Production Webhook
- Create webhook endpoint for production domain
- Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

### 3. Deploy
```bash
npm run build
vercel --prod
```

## 💡 Adding PayPal (Optional)

To add PayPal + Venmo support as mentioned in your guide, you can:

1. Get PayPal Client ID from https://developer.paypal.com
2. Add PayPal SDK to your pages
3. Create PayPal button alongside Stripe checkout

Would you like me to implement the PayPal integration as well?

## 🔧 Customization

### Modify Plans
Edit `app/api/create-checkout-session/route.ts` to:
- Add more plan types
- Change pricing
- Modify subscription intervals

### Update Success Page
Edit `app/payment/success/page.tsx` to:
- Add custom messaging
- Redirect to specific pages
- Send welcome emails

### Webhook Actions
Edit `app/api/webhooks/stripe/route.ts` to:
- Save customers to database
- Send emails
- Grant access to specific features

## 🆘 Troubleshooting

### Common Issues

**Payment button not working?**
- Check browser console for errors
- Verify environment variables are set
- Make sure Stripe keys are valid

**Webhook not firing?**
- Check webhook URL is publicly accessible
- Verify webhook secret matches
- Check Stripe Dashboard > Webhooks for delivery attempts

**Test mode showing real payment methods?**
- Make sure you're using test keys (`pk_test_` and `sk_test_`)
- Clear browser cache and cookies

## 📞 Support

- Stripe Documentation: https://docs.stripe.com
- Stripe Support: Available in your Stripe Dashboard
- Test your integration: https://stripe.com/docs/testing
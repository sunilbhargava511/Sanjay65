import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENV_PATH = join(process.cwd(), '.env.local');

// In-memory storage for demo - in production, use encrypted storage
let stripeConfig = {
  secretKey: '',
  publishableKey: '',
  webhookSecret: '',
  priceId: '',
  configured: false
};

export async function GET() {
  try {
    // Check if environment variables are already set
    const hasSecretKey = process.env.STRIPE_SECRET_KEY && 
      process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_test_secret_key_here';
    const hasPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== 'pk_test_your_stripe_test_publishable_key_here';
    const hasPriceId = process.env.STRIPE_PRICE_ID && 
      process.env.STRIPE_PRICE_ID !== 'price_your_stripe_price_id_here';
    
    if (hasSecretKey && hasPublishableKey) {
      return NextResponse.json({
        secretKey: '••••••••••••••••', // Masked for security
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '••••••••••••••••' : '', // Masked for security
        priceId: process.env.STRIPE_PRICE_ID || '',
        configured: true
      });
    }

    // Return current config (masked)
    return NextResponse.json({
      secretKey: stripeConfig.secretKey ? '••••••••••••••••' : '',
      publishableKey: stripeConfig.publishableKey,
      webhookSecret: stripeConfig.webhookSecret ? '••••••••••••••••' : '',
      priceId: stripeConfig.priceId,
      configured: stripeConfig.configured
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secretKey, publishableKey, webhookSecret, priceId } = body;

    if (!secretKey || !publishableKey) {
      return NextResponse.json(
        { error: 'Secret key and publishable key are required' },
        { status: 400 }
      );
    }

    // Validate key formats
    if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
      return NextResponse.json(
        { error: 'Invalid secret key format' },
        { status: 400 }
      );
    }

    if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
      return NextResponse.json(
        { error: 'Invalid publishable key format' },
        { status: 400 }
      );
    }

    // Check if both keys are from the same environment
    const isTestMode = secretKey.startsWith('sk_test_');
    const isPubTestMode = publishableKey.startsWith('pk_test_');
    
    if (isTestMode !== isPubTestMode) {
      return NextResponse.json(
        { error: 'Secret key and publishable key must be from the same environment (both test or both live)' },
        { status: 400 }
      );
    }

    // Validate price ID format if provided
    if (priceId && !priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Invalid price ID format. Must start with "price_"' },
        { status: 400 }
      );
    }

    // Update environment file
    try {
      let envContent = '';
      if (existsSync(ENV_PATH)) {
        envContent = readFileSync(ENV_PATH, 'utf8');
      }

      // Update or add the keys
      const lines = envContent.split('\n');
      const updatedLines = [];
      let foundSecret = false;
      let foundPublishable = false;
      let foundWebhook = false;
      let foundPriceId = false;

      for (const line of lines) {
        if (line.startsWith('STRIPE_SECRET_KEY=')) {
          updatedLines.push(`STRIPE_SECRET_KEY=${secretKey}`);
          foundSecret = true;
        } else if (line.startsWith('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=')) {
          updatedLines.push(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${publishableKey}`);
          foundPublishable = true;
        } else if (line.startsWith('STRIPE_WEBHOOK_SECRET=')) {
          updatedLines.push(`STRIPE_WEBHOOK_SECRET=${webhookSecret || ''}`);
          foundWebhook = true;
        } else if (line.startsWith('STRIPE_PRICE_ID=')) {
          updatedLines.push(`STRIPE_PRICE_ID=${priceId || ''}`);
          foundPriceId = true;
        } else {
          updatedLines.push(line);
        }
      }

      // Add missing keys
      if (!foundSecret) {
        updatedLines.push(`STRIPE_SECRET_KEY=${secretKey}`);
      }
      if (!foundPublishable) {
        updatedLines.push(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${publishableKey}`);
      }
      if (!foundWebhook && webhookSecret) {
        updatedLines.push(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`);
      }
      if (!foundPriceId && priceId) {
        updatedLines.push(`STRIPE_PRICE_ID=${priceId}`);
      }

      writeFileSync(ENV_PATH, updatedLines.join('\n'));

      // Update in-memory config
      stripeConfig = {
        secretKey,
        publishableKey,
        webhookSecret: webhookSecret || '',
        priceId: priceId || '',
        configured: true
      };

      return NextResponse.json({
        success: true,
        configured: true,
        message: 'Stripe configuration saved successfully. Please restart the application for changes to take effect.'
      });

    } catch (fileError) {
      console.error('Error updating .env.local:', fileError);
      
      // Fallback to in-memory storage
      stripeConfig = {
        secretKey,
        publishableKey,
        webhookSecret: webhookSecret || '',
        priceId: priceId || '',
        configured: true
      };

      return NextResponse.json({
        success: true,
        configured: true,
        message: 'Configuration saved in memory. For persistence, please manually add keys to .env.local'
      });
    }

  } catch (error) {
    console.error('Error saving Stripe config:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
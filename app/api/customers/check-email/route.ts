import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, normalizeEmail } from '@/lib/cookies';

// Import the customers storage from the main customers route
// In production, this would access the same database
const customers: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    
    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const customerExists = customers.has(normalizedEmail);
    const customer = customerExists ? customers.get(normalizedEmail) : null;

    return NextResponse.json({
      exists: customerExists,
      email: normalizedEmail,
      customer: customer ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone
      } : null
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
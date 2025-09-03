import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, normalizeEmail } from '@/lib/cookies';
import { userRepository } from '@/lib/repositories/users';

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
    const customer = userRepository.findByEmail(normalizedEmail);
    const customerExists = customer !== null;

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
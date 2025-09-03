import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, normalizeEmail } from '@/lib/cookies';
import { userRepository, Customer } from '@/lib/repositories/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, notes, marketingConsent, smsConsent } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
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

    // Use upsertByEmail to create or update customer
    const result = userRepository.upsertByEmail({
      email: normalizedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
      notes: notes?.trim(),
      marketingConsent: marketingConsent ?? false,
      smsConsent: smsConsent ?? false
    });

    return NextResponse.json({
      customer: result.customer,
      isNewCustomer: result.isNewCustomer
    }, { status: result.isNewCustomer ? 201 : 200 });

  } catch (error) {
    console.error('Error creating/updating customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all customers (for admin use)
    const customerArray = userRepository.findAll();
    
    return NextResponse.json({
      customers: customerArray,
      count: customerArray.length
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
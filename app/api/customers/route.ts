import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, normalizeEmail } from '@/lib/cookies';

// In-memory storage for demo purposes
// In production, this would be a proper database
const customers: Map<string, Customer> = new Map();

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  notes?: string;
  marketingConsent: boolean;
  smsConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

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

    const now = new Date().toISOString();

    // Check if customer already exists
    const existingCustomer = customers.get(normalizedEmail);
    
    if (existingCustomer) {
      // Update existing customer
      const updatedCustomer: Customer = {
        ...existingCustomer,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || existingCustomer.phone,
        notes: notes?.trim() || existingCustomer.notes,
        marketingConsent: marketingConsent ?? existingCustomer.marketingConsent,
        smsConsent: smsConsent ?? existingCustomer.smsConsent,
        updatedAt: now
      };

      customers.set(normalizedEmail, updatedCustomer);
      
      return NextResponse.json({
        customer: updatedCustomer,
        isNewCustomer: false
      });
    }

    // Create new customer
    const newCustomer: Customer = {
      id: generateId(),
      email: normalizedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
      notes: notes?.trim(),
      marketingConsent: marketingConsent ?? false,
      smsConsent: smsConsent ?? false,
      createdAt: now,
      updatedAt: now
    };

    customers.set(normalizedEmail, newCustomer);

    return NextResponse.json({
      customer: newCustomer,
      isNewCustomer: true
    }, { status: 201 });

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
    const customerArray = Array.from(customers.values());
    
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
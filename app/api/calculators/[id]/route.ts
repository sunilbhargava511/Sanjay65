import { NextRequest, NextResponse } from 'next/server';
import { Calculator } from '../route';

// Import the same in-memory storage (in production, this would be a database)
declare global {
  var calculators: Map<string, Calculator> | undefined;
}

const calculators = globalThis.calculators || new Map<string, Calculator>();
if (!globalThis.calculators) {
  globalThis.calculators = calculators;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Calculator ID is required' },
        { status: 400 }
      );
    }

    const calculator = calculators.get(id);
    
    if (!calculator) {
      return NextResponse.json(
        { success: false, error: 'Calculator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      calculator
    });

  } catch (error) {
    console.error('Error fetching calculator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Calculator ID is required' },
        { status: 400 }
      );
    }

    const existingCalculator = calculators.get(id);
    if (!existingCalculator) {
      return NextResponse.json(
        { success: false, error: 'Calculator not found' },
        { status: 404 }
      );
    }

    const updatedCalculator: Calculator = {
      ...existingCalculator,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    calculators.set(id, updatedCalculator);

    return NextResponse.json({
      success: true,
      calculator: updatedCalculator
    });

  } catch (error) {
    console.error('Error updating calculator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Calculator ID is required' },
        { status: 400 }
      );
    }

    const calculator = calculators.get(id);
    if (!calculator) {
      return NextResponse.json(
        { success: false, error: 'Calculator not found' },
        { status: 404 }
      );
    }

    calculators.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Calculator deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting calculator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

// Import the calculators Map from the main route
// In a real app, this would be a shared database connection
const calculators: Map<number, any> = new Map();

// Initialize with the same data as the main route
if (calculators.size === 0) {
  calculators.set(1, {
    id: 1,
    name: 'Save/Spend Calculator',
    description: 'Calculate your optimal savings rate and spending plan based on your income and expenses.',
    url: '/calculator/save-spend',
    category: 'financial',
    icon: 'Calculator',
    color: 'bg-blue-500',
    isActive: true,
    fields: [
      {
        name: 'monthly_income',
        label: 'Monthly After-Tax Income',
        type: 'number',
        placeholder: '5000',
        required: true
      },
      {
        name: 'housing',
        label: 'Housing (Rent/Mortgage)',
        type: 'number',
        placeholder: '1500',
        required: true
      },
      {
        name: 'food',
        label: 'Food & Groceries',
        type: 'number',
        placeholder: '600',
        required: true
      },
      {
        name: 'transportation',
        label: 'Transportation',
        type: 'number',
        placeholder: '400',
        required: true
      },
      {
        name: 'utilities',
        label: 'Utilities',
        type: 'number',
        placeholder: '200',
        required: true
      },
      {
        name: 'insurance',
        label: 'Insurance',
        type: 'number',
        placeholder: '300',
        required: true
      }
    ]
  });

  calculators.set(2, {
    id: 2,
    name: 'Emergency Fund Calculator',
    description: 'Determine how much you need in your emergency fund based on your expenses.',
    url: '/calculator/emergency-fund',
    category: 'savings',
    icon: 'Shield',
    color: 'bg-green-500',
    isActive: false,
    fields: [
      {
        name: 'monthly_expenses',
        label: 'Monthly Essential Expenses',
        type: 'number',
        placeholder: '3000',
        required: true
      },
      {
        name: 'months_coverage',
        label: 'Months of Coverage',
        type: 'number',
        placeholder: '6',
        required: true
      }
    ]
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const calculator = calculators.get(id);
    
    if (!calculator) {
      return NextResponse.json(
        { error: 'Calculator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(calculator);
  } catch (error) {
    console.error('Error fetching calculator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const calculator = calculators.get(id);
    
    if (!calculator) {
      return NextResponse.json(
        { error: 'Calculator not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      url,
      category,
      icon,
      color,
      isActive,
      fields
    } = body;

    // Update calculator with new data
    const updatedCalculator = {
      ...calculator,
      name: name?.trim() || calculator.name,
      description: description?.trim() || calculator.description,
      url: url?.trim() || calculator.url,
      category: category || calculator.category,
      icon: icon || calculator.icon,
      color: color || calculator.color,
      isActive: isActive !== undefined ? isActive : calculator.isActive,
      fields: Array.isArray(fields) ? fields : calculator.fields
    };

    calculators.set(id, updatedCalculator);

    return NextResponse.json(updatedCalculator);
  } catch (error) {
    console.error('Error updating calculator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const calculator = calculators.get(id);
    
    if (!calculator) {
      return NextResponse.json(
        { error: 'Calculator not found' },
        { status: 404 }
      );
    }

    calculators.delete(id);

    return NextResponse.json({ message: 'Calculator deleted successfully' });
  } catch (error) {
    console.error('Error deleting calculator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
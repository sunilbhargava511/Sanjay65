import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, this would be a proper database
const calculators: Map<number, CalculatorTool> = new Map();

export interface CalculatorTool {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
  }>;
}

// Initialize with demo calculators
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

let nextId = 3; // Start from 3 since we have 2 initial calculators

function generateId(): number {
  return nextId++;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const category = searchParams.get('category');

    let calculatorList = Array.from(calculators.values());
    
    if (activeOnly) {
      calculatorList = calculatorList.filter(calc => calc.isActive);
    }
    
    if (category && category !== 'all') {
      calculatorList = calculatorList.filter(calc => calc.category === category);
    }
    
    // Sort by id for consistent ordering
    calculatorList.sort((a, b) => a.id - b.id);

    return NextResponse.json(calculatorList);

  } catch (error) {
    console.error('Error fetching calculators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      url,
      category = 'financial',
      icon = 'Calculator',
      color = 'bg-blue-500',
      isActive = true,
      fields = []
    } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const calculatorId = generateId();
    
    const newCalculator: CalculatorTool = {
      id: calculatorId,
      name: name.trim(),
      description: description.trim(),
      url: url?.trim() || '',
      category,
      icon,
      color,
      isActive,
      fields: Array.isArray(fields) ? fields : []
    };

    calculators.set(calculatorId, newCalculator);

    return NextResponse.json(newCalculator, { status: 201 });

  } catch (error) {
    console.error('Error creating calculator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, this would be a proper database
const calculators: Map<string, Calculator> = new Map();

export interface Calculator {
  id: string;
  name: string;
  description: string;
  url?: string;
  calculatorType: 'url' | 'code';
  codeContent?: string;
  fileName?: string;
  orderIndex: number;
  active: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Initialize with demo calculators
if (calculators.size === 0) {
  const now = new Date().toISOString();
  
  calculators.set('save-calculator', {
    id: 'save-calculator',
    name: 'Save/Spend Number Calculator',
    description: 'Calculate your monthly savings target for retirement goals',
    calculatorType: 'code',
    fileName: 'save-calculator.html',
    orderIndex: 0,
    active: true,
    isPublished: true,
    createdAt: now,
    updatedAt: now
  });
  
  calculators.set('emergency-fund', {
    id: 'emergency-fund',
    name: 'Emergency Fund Calculator',
    description: 'Determine the right emergency fund size for your situation',
    calculatorType: 'code',
    fileName: 'emergency-fund.html',
    orderIndex: 1,
    active: true,
    isPublished: true,
    createdAt: now,
    updatedAt: now
  });
}

function generateId(): string {
  return 'calc_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let calculatorList = Array.from(calculators.values());
    
    if (activeOnly) {
      calculatorList = calculatorList.filter(calc => calc.active && calc.isPublished);
    }
    
    // Sort by orderIndex
    calculatorList.sort((a, b) => a.orderIndex - b.orderIndex);

    return NextResponse.json({
      success: true,
      calculators: calculatorList,
      count: calculatorList.length
    });

  } catch (error) {
    console.error('Error fetching calculators:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
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
      calculatorType = 'url', 
      codeContent, 
      fileName, 
      orderIndex,
      isPublished = true 
    } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Validate based on calculator type
    if (calculatorType === 'url' && !url) {
      return NextResponse.json(
        { success: false, error: 'URL is required for URL-based calculators' },
        { status: 400 }
      );
    }

    if (calculatorType === 'code' && !codeContent) {
      return NextResponse.json(
        { success: false, error: 'Code content is required for code-based calculators' },
        { status: 400 }
      );
    }

    const calculatorId = generateId();
    const now = new Date().toISOString();
    
    // Get the highest order index if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const existingCalculators = Array.from(calculators.values());
      finalOrderIndex = existingCalculators.length;
    }

    const newCalculator: Calculator = {
      id: calculatorId,
      name: name.trim(),
      description: description.trim(),
      url: url?.trim() || undefined,
      calculatorType,
      codeContent: codeContent?.trim() || undefined,
      fileName: fileName?.trim() || undefined,
      orderIndex: finalOrderIndex,
      active: true,
      isPublished,
      createdAt: now,
      updatedAt: now
    };

    calculators.set(calculatorId, newCalculator);

    return NextResponse.json({
      success: true,
      calculator: newCalculator
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating calculator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
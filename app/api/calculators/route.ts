import { NextRequest, NextResponse } from 'next/server';
import { calculators, CalculatorTool, generateId } from './data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('active') === 'true';
    
    let calculatorList = Array.from(calculators.values());
    
    if (category && category !== 'all') {
      calculatorList = calculatorList.filter(calc => calc.category === category);
    }
    
    if (activeOnly) {
      calculatorList = calculatorList.filter(calc => calc.isActive);
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
      category = 'financial', 
      description,
      url,
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
      category,
      description: description.trim(),
      url: url?.trim() || `/calculator/${calculatorId}`,
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
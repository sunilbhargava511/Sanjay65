import { NextRequest, NextResponse } from 'next/server';
import { calculatorRepository } from '@/lib/repositories/calculators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('active') === 'true';
    
    let calculators = activeOnly 
      ? calculatorRepository.findPublished()
      : calculatorRepository.findAll();
    
    if (category && category !== 'all') {
      calculators = calculators.filter(calc => calc.category === category);
    }

    return NextResponse.json(calculators);

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
      calculatorType = 'code',
      code,
      fileName,
      artifactUrl,
      orderIndex,
      isPublished = true,
      content,
      fields = []
    } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }
    
    // Validate required fields based on calculator type
    if (calculatorType === 'url' && !url) {
      return NextResponse.json(
        { error: 'URL is required for URL-based calculators' },
        { status: 400 }
      );
    }
    if (calculatorType === 'code' && !code) {
      return NextResponse.json(
        { error: 'Code content is required for code-based calculators' },
        { status: 400 }
      );
    }

    // Get the next available order index if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const existingCalculators = calculatorRepository.findAll();
      finalOrderIndex = existingCalculators.length;
    }

    // Get next ID for URL generation
    const nextId = calculatorRepository.getNextId();
    
    const newCalculator = calculatorRepository.create({
      name: name.trim(),
      category,
      description: description.trim(),
      url: url?.trim() || `/calculator/${nextId}`,
      icon,
      color,
      isActive,
      calculatorType,
      code: code || undefined,
      content: content || undefined,
      fileName,
      artifactUrl,
      orderIndex: finalOrderIndex,
      isPublished,
      fields: Array.isArray(fields) ? fields : []
    });

    return NextResponse.json(newCalculator, { status: 201 });

  } catch (error) {
    console.error('Error creating calculator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
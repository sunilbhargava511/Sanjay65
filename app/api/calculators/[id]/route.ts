import { NextRequest, NextResponse } from 'next/server';
import { calculators, CalculatorTool } from '../data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
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
      calculatorType,
      code,
      fileName,
      artifactUrl,
      orderIndex,
      isPublished,
      fields
    } = body;

    // Update calculator with new data
    const updatedCalculator: CalculatorTool = {
      ...calculator,
      name: name?.trim() || calculator.name,
      description: description?.trim() || calculator.description,
      url: url?.trim() || calculator.url,
      category: category || calculator.category,
      icon: icon || calculator.icon,
      color: color || calculator.color,
      isActive: isActive !== undefined ? isActive : calculator.isActive,
      calculatorType: calculatorType || calculator.calculatorType,
      code: code !== undefined ? code : calculator.code,
      fileName: fileName !== undefined ? fileName : calculator.fileName,
      artifactUrl: artifactUrl !== undefined ? artifactUrl : calculator.artifactUrl,
      orderIndex: orderIndex !== undefined ? orderIndex : calculator.orderIndex,
      isPublished: isPublished !== undefined ? isPublished : calculator.isPublished,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
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
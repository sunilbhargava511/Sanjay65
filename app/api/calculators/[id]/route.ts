import { NextRequest, NextResponse } from 'next/server';
import { calculatorRepository } from '@/lib/repositories/calculators';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const calculator = calculatorRepository.findById(id);
    
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
      content,
      fileName,
      artifactUrl,
      orderIndex,
      isPublished,
      fields
    } = body;

    // Update calculator with new data
    const updatedCalculator = calculatorRepository.update(id, {
      name: name?.trim(),
      description: description?.trim(),
      url: url?.trim(),
      category,
      icon,
      color,
      isActive,
      calculatorType,
      code,
      content,
      fileName,
      artifactUrl,
      orderIndex,
      isPublished,
      fields: Array.isArray(fields) ? fields : undefined
    });

    if (!updatedCalculator) {
      return NextResponse.json(
        { error: 'Calculator not found' },
        { status: 404 }
      );
    }

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
    
    const deleted = calculatorRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Calculator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Calculator deleted successfully' });
  } catch (error) {
    console.error('Error deleting calculator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
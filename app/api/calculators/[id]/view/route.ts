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

    // Check if calculator has stored content (for production file uploads)
    if (calculator.content) {
      return new NextResponse(calculator.content, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // If no stored content, redirect to the URL
    if (calculator.url) {
      return NextResponse.redirect(calculator.url);
    }

    return NextResponse.json(
      { error: 'Calculator content not available' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error serving calculator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
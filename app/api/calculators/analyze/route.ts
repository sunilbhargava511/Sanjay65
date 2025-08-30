import { NextRequest, NextResponse } from 'next/server';
import { CalculatorAnalyzer } from '../../../../lib/calculator-analyzer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Analyze the calculator
    const analysis = await CalculatorAnalyzer.analyzeFromFormData(formData);
    
    return NextResponse.json({
      success: true,
      analysis
    });
    
  } catch (error) {
    console.error('Calculator analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      },
      { status: 400 }
    );
  }
}
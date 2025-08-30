import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'docs', 'USER_GUIDE.md');
    const content = readFileSync(filePath, 'utf8');
    
    return NextResponse.json({
      content,
      title: 'ZeroFinanx User Guide'
    });
  } catch (error) {
    console.error('Error reading user guide:', error);
    return NextResponse.json(
      { error: 'Failed to load user guide' },
      { status: 500 }
    );
  }
}
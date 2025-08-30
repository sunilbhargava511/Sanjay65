import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'docs', 'ADMIN_GUIDE.md');
    const content = readFileSync(filePath, 'utf8');
    
    return NextResponse.json({
      content,
      title: 'Admin Configuration & Operations Guide'
    });
  } catch (error) {
    console.error('Error reading admin guide:', error);
    return NextResponse.json(
      { error: 'Failed to load admin guide' },
      { status: 500 }
    );
  }
}
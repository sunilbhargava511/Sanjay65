import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to the database file
    const dbPath = path.join(process.cwd(), 'data', 'zerofinanx.db');
    
    // Check if database file exists
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json(
        { error: 'Database file not found' },
        { status: 404 }
      );
    }
    
    // Read the database file
    const dbBuffer = fs.readFileSync(dbPath);
    
    // Create response with appropriate headers for file download
    return new Response(dbBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="zerofinanx_backup_${new Date().toISOString().slice(0, 10)}.db"`,
        'Content-Length': dbBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error exporting database:', error);
    return NextResponse.json(
      { error: 'Failed to export database' },
      { status: 500 }
    );
  }
}
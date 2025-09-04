import { NextResponse } from 'next/server';
import fs from 'fs';
import { getDatabasePath, getDatabase } from '@/lib/database';
import Database from 'better-sqlite3';

export async function GET() {
  try {
    // Path to the database file - use the same path as the main app
    const dbPath = getDatabasePath();
    
    // Check if database file exists
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json(
        { error: 'Database file not found' },
        { status: 404 }
      );
    }
    
    // Force WAL checkpoint to ensure all data is in the main file
    const db = getDatabase();
    db.pragma('wal_checkpoint(FULL)');
    
    // Read the database file after checkpoint
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
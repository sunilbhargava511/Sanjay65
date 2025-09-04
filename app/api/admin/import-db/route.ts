import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDatabasePath } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('database') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type (basic check)
    if (!file.name.endsWith('.db')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please provide a .db file' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Path to the database file - use the same path as the main app
    const dbPath = getDatabasePath();
    const backupPath = path.join(process.cwd(), 'data', `zerofinanx_backup_${Date.now()}.db`);
    
    // Create backup of existing database
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
    }
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write new database file
    fs.writeFileSync(dbPath, buffer);
    
    return NextResponse.json({
      success: true,
      message: 'Database imported successfully',
      backup: backupPath
    });
  } catch (error) {
    console.error('Error importing database:', error);
    return NextResponse.json(
      { error: 'Failed to import database' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'zerofinanx.db');
    
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({
        exists: false,
        path: dbPath,
        cwd: process.cwd()
      });
    }
    
    const stats = fs.statSync(dbPath);
    
    return NextResponse.json({
      exists: true,
      path: dbPath,
      cwd: process.cwd(),
      size: stats.size,
      sizeKB: Math.round(stats.size / 1024),
      lastModified: stats.mtime
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      cwd: process.cwd()
    }, { status: 500 });
  }
}
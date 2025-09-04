import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'zerofinanx.db');
    
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: 'Database not found' }, { status: 404 });
    }
    
    const db = new Database(dbPath, { readonly: true });
    
    // Get all tables
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all() as Array<{name: string}>;
    
    const tableInfo: Record<string, any> = {};
    
    for (const table of tables) {
      try {
        // Get count
        const countResult = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as {count: number};
        
        // Get sample data (first 3 rows)
        const sampleData = db.prepare(`SELECT * FROM ${table.name} LIMIT 3`).all();
        
        tableInfo[table.name] = {
          count: countResult.count,
          sample: sampleData
        };
      } catch (err) {
        tableInfo[table.name] = {
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }
    
    db.close();
    
    return NextResponse.json({
      tables: tableInfo,
      totalTables: tables.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
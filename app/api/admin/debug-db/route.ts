import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    // Use the same database connection as the main app
    const db = getDatabase();
    
    const result: Record<string, any> = {};
    
    // Get lessons count and sample
    try {
      const lessonsCount = db.prepare('SELECT COUNT(*) as count FROM lessons').get() as {count: number};
      const lessonsSample = db.prepare('SELECT id, title, active FROM lessons LIMIT 3').all();
      result.lessons = { count: lessonsCount.count, sample: lessonsSample };
    } catch (err) {
      result.lessons = { error: err instanceof Error ? err.message : 'Unknown error' };
    }
    
    // Get calculators count and sample
    try {
      const calculatorsCount = db.prepare('SELECT COUNT(*) as count FROM calculators').get() as {count: number};
      const calculatorsSample = db.prepare('SELECT id, title, active FROM calculators LIMIT 3').all();
      result.calculators = { count: calculatorsCount.count, sample: calculatorsSample };
    } catch (err) {
      result.calculators = { error: err instanceof Error ? err.message : 'Unknown error' };
    }
    
    // Get users count
    try {
      const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as {count: number};
      result.users = { count: usersCount.count };
    } catch (err) {
      result.users = { error: err instanceof Error ? err.message : 'Unknown error' };
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
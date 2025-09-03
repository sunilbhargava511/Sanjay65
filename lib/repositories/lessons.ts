import { getDatabase } from '../database';

export interface Lesson {
  id: number;
  title: string;
  category: string;
  duration: string;
  difficulty: string;
  description: string;
  content: string;
  videoUrl?: string;
  videoSummary?: string;
  startMessage?: string;
  orderIndex: number;
  icon: string;
  color: string;
  completed: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LessonRow {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  duration: string | null;
  difficulty: string;
  video_url: string | null;
  video_summary: string | null;
  start_message: string | null;
  icon: string;
  color: string;
  order_index: number;
  active: number;
  completed: number;
  created_at: string;
  updated_at: string;
}

class LessonRepository {
  private db = getDatabase();

  // Convert database row to Lesson interface
  private rowToLesson(row: LessonRow): Lesson {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      duration: row.duration || '',
      difficulty: row.difficulty,
      description: row.description,
      content: row.content,
      videoUrl: row.video_url || undefined,
      videoSummary: row.video_summary || undefined,
      startMessage: row.start_message || undefined,
      orderIndex: row.order_index,
      icon: row.icon,
      color: row.color,
      completed: Boolean(row.completed),
      active: Boolean(row.active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Get all lessons
  findAll(): Lesson[] {
    const stmt = this.db.prepare(`
      SELECT * FROM lessons 
      ORDER BY order_index ASC, created_at ASC
    `);
    
    const rows = stmt.all() as LessonRow[];
    return rows.map(row => this.rowToLesson(row));
  }

  // Get active lessons only
  findActive(): Lesson[] {
    const stmt = this.db.prepare(`
      SELECT * FROM lessons 
      WHERE active = 1
      ORDER BY order_index ASC, created_at ASC
    `);
    
    const rows = stmt.all() as LessonRow[];
    return rows.map(row => this.rowToLesson(row));
  }

  // Find lessons by category
  findByCategory(category: string): Lesson[] {
    const stmt = this.db.prepare(`
      SELECT * FROM lessons 
      WHERE category = ? AND active = 1
      ORDER BY order_index ASC, created_at ASC
    `);
    
    const rows = stmt.all(category) as LessonRow[];
    return rows.map(row => this.rowToLesson(row));
  }

  // Find lesson by ID
  findById(id: number): Lesson | null {
    const stmt = this.db.prepare(`
      SELECT * FROM lessons WHERE id = ?
    `);
    
    const row = stmt.get(id) as LessonRow | undefined;
    return row ? this.rowToLesson(row) : null;
  }

  // Create new lesson
  create(lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Lesson {
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO lessons (
        title, description, content, category, duration, difficulty,
        video_url, video_summary, start_message, icon, color, order_index,
        active, completed, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      lesson.title,
      lesson.description,
      lesson.content,
      lesson.category,
      lesson.duration || null,
      lesson.difficulty,
      lesson.videoUrl || null,
      lesson.videoSummary || null,
      lesson.startMessage || null,
      lesson.icon,
      lesson.color,
      lesson.orderIndex,
      lesson.active ? 1 : 0,
      lesson.completed ? 1 : 0,
      now,
      now
    );

    const created = this.findById(result.lastInsertRowid as number);
    if (!created) {
      throw new Error('Failed to create lesson');
    }

    return created;
  }

  // Update lesson
  update(id: number, updates: Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>): Lesson | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      UPDATE lessons SET
        title = ?, description = ?, content = ?, category = ?, duration = ?,
        difficulty = ?, video_url = ?, video_summary = ?, start_message = ?,
        icon = ?, color = ?, order_index = ?, active = ?, completed = ?,
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      updates.title ?? existing.title,
      updates.description ?? existing.description,
      updates.content ?? existing.content,
      updates.category ?? existing.category,
      updates.duration ?? existing.duration ?? null,
      updates.difficulty ?? existing.difficulty,
      updates.videoUrl ?? existing.videoUrl ?? null,
      updates.videoSummary ?? existing.videoSummary ?? null,
      updates.startMessage ?? existing.startMessage ?? null,
      updates.icon ?? existing.icon,
      updates.color ?? existing.color,
      updates.orderIndex ?? existing.orderIndex,
      (updates.active ?? existing.active) ? 1 : 0,
      (updates.completed ?? existing.completed) ? 1 : 0,
      now,
      id
    );

    return this.findById(id);
  }

  // Delete lesson
  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM lessons WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get lessons count by category
  getCountByCategory(): Record<string, number> {
    const stmt = this.db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM lessons 
      WHERE active = 1
      GROUP BY category
    `);
    
    const rows = stmt.all() as Array<{ category: string; count: number }>;
    return rows.reduce((acc, row) => {
      acc[row.category] = row.count;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Export singleton instance
export const lessonRepository = new LessonRepository();
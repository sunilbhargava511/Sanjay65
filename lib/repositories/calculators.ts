import { getDatabase, generateId } from '../database';

export interface CalculatorTool {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
  calculatorType: 'url' | 'code';
  code?: string;
  fileName?: string;
  artifactUrl?: string;
  orderIndex: number;
  isPublished: boolean;
  content?: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CalculatorRow {
  id: number;
  name: string;
  description: string;
  category: string;
  calculator_type: string;
  code: string | null;
  content: string | null;
  url: string;
  icon: string;
  color: string;
  fields: string;
  is_active: number;
  is_published: number;
  order_index: number;
  file_name: string | null;
  artifact_url: string | null;
  created_at: string;
  updated_at: string;
}

class CalculatorRepository {
  private db = getDatabase();

  // Convert database row to CalculatorTool interface
  private rowToCalculator(row: CalculatorRow): CalculatorTool {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      url: row.url,
      icon: row.icon,
      color: row.color,
      isActive: Boolean(row.is_active),
      calculatorType: row.calculator_type as 'url' | 'code',
      code: row.code || undefined,
      fileName: row.file_name || undefined,
      artifactUrl: row.artifact_url || undefined,
      orderIndex: row.order_index,
      isPublished: Boolean(row.is_published),
      content: row.content || undefined,
      fields: row.fields ? JSON.parse(row.fields) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Get all calculators
  findAll(): CalculatorTool[] {
    const stmt = this.db.prepare(`
      SELECT * FROM calculators 
      ORDER BY order_index ASC, created_at ASC
    `);
    
    const rows = stmt.all() as CalculatorRow[];
    return rows.map(row => this.rowToCalculator(row));
  }

  // Get published calculators only
  findPublished(): CalculatorTool[] {
    const stmt = this.db.prepare(`
      SELECT * FROM calculators 
      WHERE is_published = 1 AND is_active = 1
      ORDER BY order_index ASC, created_at ASC
    `);
    
    const rows = stmt.all() as CalculatorRow[];
    return rows.map(row => this.rowToCalculator(row));
  }

  // Find calculator by ID
  findById(id: number): CalculatorTool | null {
    const stmt = this.db.prepare(`
      SELECT * FROM calculators WHERE id = ?
    `);
    
    const row = stmt.get(id) as CalculatorRow | undefined;
    return row ? this.rowToCalculator(row) : null;
  }

  // Create new calculator
  create(calculator: Omit<CalculatorTool, 'id' | 'createdAt' | 'updatedAt'>): CalculatorTool {
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO calculators (
        name, description, category, calculator_type, code, content,
        url, icon, color, fields, is_active, is_published, order_index,
        file_name, artifact_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      calculator.name,
      calculator.description,
      calculator.category,
      calculator.calculatorType,
      calculator.code || null,
      calculator.content || null,
      calculator.url,
      calculator.icon,
      calculator.color,
      JSON.stringify(calculator.fields),
      calculator.isActive ? 1 : 0,
      calculator.isPublished ? 1 : 0,
      calculator.orderIndex,
      calculator.fileName || null,
      calculator.artifactUrl || null,
      now,
      now
    );

    const created = this.findById(result.lastInsertRowid as number);
    if (!created) {
      throw new Error('Failed to create calculator');
    }

    return created;
  }

  // Update calculator
  update(id: number, updates: Partial<Omit<CalculatorTool, 'id' | 'createdAt' | 'updatedAt'>>): CalculatorTool | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      UPDATE calculators SET
        name = ?, description = ?, category = ?, calculator_type = ?,
        code = ?, content = ?, url = ?, icon = ?, color = ?, fields = ?,
        is_active = ?, is_published = ?, order_index = ?, file_name = ?,
        artifact_url = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      updates.name ?? existing.name,
      updates.description ?? existing.description,
      updates.category ?? existing.category,
      updates.calculatorType ?? existing.calculatorType,
      updates.code ?? existing.code ?? null,
      updates.content ?? existing.content ?? null,
      updates.url ?? existing.url,
      updates.icon ?? existing.icon,
      updates.color ?? existing.color,
      JSON.stringify(updates.fields ?? existing.fields),
      (updates.isActive ?? existing.isActive) ? 1 : 0,
      (updates.isPublished ?? existing.isPublished) ? 1 : 0,
      updates.orderIndex ?? existing.orderIndex,
      updates.fileName ?? existing.fileName ?? null,
      updates.artifactUrl ?? existing.artifactUrl ?? null,
      now,
      id
    );

    return this.findById(id);
  }

  // Delete calculator
  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM calculators WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get next available ID (for URL generation)
  getNextId(): number {
    const stmt = this.db.prepare('SELECT MAX(id) as maxId FROM calculators');
    const result = stmt.get() as { maxId: number | null };
    return (result.maxId || 0) + 1;
  }
}

// Export singleton instance
export const calculatorRepository = new CalculatorRepository();
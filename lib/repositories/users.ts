import { getDatabase, generateId } from '../database';

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  notes?: string;
  marketingConsent: boolean;
  smsConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  notes: string | null;
  marketing_consent: number;
  sms_consent: number;
  created_at: string;
  updated_at: string;
}

class UserRepository {
  private db = getDatabase();

  // Convert database row to Customer interface
  private rowToCustomer(row: UserRow): Customer {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name || '',
      lastName: row.last_name || '',
      phone: row.phone || undefined,
      notes: row.notes || undefined,
      marketingConsent: Boolean(row.marketing_consent),
      smsConsent: Boolean(row.sms_consent),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Get all users
  findAll(): Customer[] {
    const stmt = this.db.prepare(`
      SELECT * FROM users 
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all() as UserRow[];
    return rows.map(row => this.rowToCustomer(row));
  }

  // Find user by ID
  findById(id: string): Customer | null {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE id = ?
    `);
    
    const row = stmt.get(id) as UserRow | undefined;
    return row ? this.rowToCustomer(row) : null;
  }

  // Find user by email
  findByEmail(email: string): Customer | null {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE email = ?
    `);
    
    const row = stmt.get(email.toLowerCase()) as UserRow | undefined;
    return row ? this.rowToCustomer(row) : null;
  }

  // Create new user
  create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    const now = new Date().toISOString();
    const id = generateId();
    
    const stmt = this.db.prepare(`
      INSERT INTO users (
        id, email, first_name, last_name, phone, notes,
        marketing_consent, sms_consent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      customer.email.toLowerCase(),
      customer.firstName || null,
      customer.lastName || null,
      customer.phone || null,
      customer.notes || null,
      customer.marketingConsent ? 1 : 0,
      customer.smsConsent ? 1 : 0,
      now,
      now
    );

    const created = this.findById(id);
    if (!created) {
      throw new Error('Failed to create user');
    }

    return created;
  }

  // Update user
  update(id: string, updates: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>): Customer | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      UPDATE users SET
        email = ?, first_name = ?, last_name = ?, phone = ?, notes = ?,
        marketing_consent = ?, sms_consent = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      (updates.email || existing.email).toLowerCase(),
      (updates.firstName ?? existing.firstName) || null,
      (updates.lastName ?? existing.lastName) || null,
      (updates.phone ?? existing.phone) || null,
      (updates.notes ?? existing.notes) || null,
      (updates.marketingConsent ?? existing.marketingConsent) ? 1 : 0,
      (updates.smsConsent ?? existing.smsConsent) ? 1 : 0,
      now,
      id
    );

    return this.findById(id);
  }

  // Update user by email (for existing users)
  updateByEmail(email: string, updates: Partial<Omit<Customer, 'id' | 'email' | 'createdAt' | 'updatedAt'>>): Customer | null {
    const existing = this.findByEmail(email);
    if (!existing) {
      return null;
    }

    return this.update(existing.id, updates);
  }

  // Create or update user by email
  upsertByEmail(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): { customer: Customer; isNewCustomer: boolean } {
    const existing = this.findByEmail(customer.email);
    
    if (existing) {
      // Update existing customer
      const updated = this.updateByEmail(customer.email, customer);
      if (!updated) {
        throw new Error('Failed to update existing customer');
      }
      return { customer: updated, isNewCustomer: false };
    } else {
      // Create new customer
      const created = this.create(customer);
      return { customer: created, isNewCustomer: true };
    }
  }

  // Delete user
  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get user count
  getCount(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM users');
    const result = stmt.get() as { count: number };
    return result.count;
  }

  // Get users with marketing consent
  findMarketingConsentUsers(): Customer[] {
    const stmt = this.db.prepare(`
      SELECT * FROM users 
      WHERE marketing_consent = 1
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all() as UserRow[];
    return rows.map(row => this.rowToCustomer(row));
  }

  // Search users by email pattern
  searchByEmail(pattern: string): Customer[] {
    const stmt = this.db.prepare(`
      SELECT * FROM users 
      WHERE email LIKE ?
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all(`%${pattern.toLowerCase()}%`) as UserRow[];
    return rows.map(row => this.rowToCustomer(row));
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
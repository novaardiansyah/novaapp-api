import pool from '@/db'

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: Date | null;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UsersModel {
  static async all(): Promise<User[]> {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY id DESC");
    return rows as User[];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];
    return users.length ? users[0] : null;
  }

  static async create(data: Omit<User, 'id' | 'created_at'>): Promise<number> {
    const [result]: any = await pool.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [data.email, data.password, data.name]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const users = rows as User[];
    return users.length ? users[0] : null;
  }
}
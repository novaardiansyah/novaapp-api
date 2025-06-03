import pool from '@/db'

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: Date | null;
  password: string ;
  created_at?: Date;
  updated_at?: Date;
}

const selectOnly = ['a.id', 'a.name', 'a.email', 'a.password', 'a.email_verified_at', 'a.created_at', 'a.updated_at'] as const;

export class UsersModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query(
      `SELECT ${selectOnly.join(', ')} FROM users AS a WHERE a.email = ? LIMIT 1`,
      [email]
    );
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
    const [rows] = await pool.query(
      `SELECT ${selectOnly.join(', ')} FROM users AS a WHERE a.id = ? LIMIT 1`,
      [id]
    );
    const users = rows as User[];
    return users.length ? users[0] : null;
  }
}
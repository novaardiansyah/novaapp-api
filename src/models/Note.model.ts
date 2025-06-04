import pool from '@/db';

const QUERY_DEBUG = process.env.QUERY_DEBUG === 'true'

export interface Note {
  id: number;
  code: string;
  title: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export class NoteModel {
  static async all(): Promise<Note[]> {
    const [rows] = await pool.query('SELECT * FROM notes ORDER BY id DESC');
    return rows as Note[];
  }

  static async paginate({ page = 1, per_page = 10 }: { page?: number; per_page?: number }): Promise<Note[]> {
    const offset = (page - 1) * per_page;
    const sql    = pool.format('SELECT * FROM notes ORDER BY updated_at DESC LIMIT ? OFFSET ?', [per_page, offset]);
    QUERY_DEBUG && console.log('SQL:', sql)

    const [rows] = await pool.query(sql);
    return rows as Note[];
  }

  static async total(): Promise<number> {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM notes');
    const total = (rows as any[])[0].total;
    return total;
  }
}
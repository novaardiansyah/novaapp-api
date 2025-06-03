import poolPromise from '@/db';

export interface Note {
  id: number;
  code: string;
  title: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export class NotesModel {
  static async all(): Promise<Note[]> {
    const pool = await poolPromise()
    const [rows] = await pool.query('SELECT * FROM notes ORDER BY id DESC');
    return rows as Note[];
  }
}
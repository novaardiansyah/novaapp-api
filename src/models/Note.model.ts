import pool from '@/db';
import { getTimes } from '@/helpers';

const QUERY_DEBUG = process.env.QUERY_DEBUG === 'true'

export interface Note {
  id: number;
  code?: string;
  title: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

interface PaginateParams {
  page: number;
  per_page: number;
  search?: string;
}

export class NoteModel {
  static async all(): Promise<Note[]> {
    const [rows] = await pool.query('SELECT * FROM notes ORDER BY id DESC');
    return rows as Note[];
  }

  static async paginate(params: PaginateParams): Promise<{ data: Note[]; total: number }> {
    const offset = (params.page - 1) * params.per_page;
    const values: any[] = [];
    let where = '';
    
    if (params.search) {
      where = 'WHERE LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)';
      values.push(`%${params.search}%`, `%${params.search}%`);
    }

    // ! 1. Get total count
    const countSql = pool.format(`SELECT COUNT(*) as total FROM notes ${where}`, values);
    const [countRows] = await pool.query(countSql) as [Array<{ total: number }>, any];
    const total = countRows[0].total;

    // ! 2. Get paginated data
    const dataSql = pool.format(`
      SELECT id, title, description, updated_at
      FROM notes
      ${where}
      ORDER BY updated_at DESC
      LIMIT ?
      OFFSET ?
    `, [...values, params.per_page, offset]);
    const [rows] = await pool.query(dataSql);
    
    QUERY_DEBUG && console.log('SQL:', dataSql);

    return { data: rows as Note[], total };
  }

  static async findById(id: number): Promise<Note | null> {
    if (isNaN(id) || id < 1) return null

    const sql = pool.format('SELECT * FROM notes WHERE id = ?', [id]);
    QUERY_DEBUG && console.log('SQL:', sql)

    const [rows] = await pool.query(sql);
    const note = (rows as Note[])[0];

    return note || null;
  }

  static async update(id: number, data: Partial<Note>): Promise<void> {
    if (isNaN(id) || id < 1) return

    data.updated_at = new Date(getTimes())

    const sql = pool.format('UPDATE notes SET ? WHERE id = ?', [data, id])
    QUERY_DEBUG && console.log('SQL:', sql)

    await pool.query(sql)
  }

  static async create(data: Omit<Note, 'id'>): Promise<void> {
    data.created_at = new Date(getTimes())
    data.updated_at = new Date(getTimes())
    data.code = Math.random().toString(36).substring(2, 10)

    const sql = pool.format('INSERT INTO notes SET ?', [data])
    QUERY_DEBUG && console.log('SQL:', sql)

    await pool.query(sql)
  }

  static async delete(id: number): Promise<void> {
    if (isNaN(id) || id < 1) return

    const sql = pool.format('DELETE FROM notes WHERE id = ?', [id])
    QUERY_DEBUG && console.log('SQL:', sql)

    await pool.query(sql)
  }
}
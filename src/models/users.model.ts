import pool from "@/db";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: Date | null;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UsersModel {
  static async all(): Promise<User[]> {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY id DESC");
    return rows as User[];
  }
}
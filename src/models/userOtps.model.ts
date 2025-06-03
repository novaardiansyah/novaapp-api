import pool from "@/db";
import { getTimes } from "@/helpers";

export interface UserOtp {
  id: number;
  user_id: number;
  type: string;
  otp: string;
  expired_at: Date;
}

export class UserOtpsModel {
  static async create(data: Omit<UserOtp, 'id'>): Promise<number> {
    const now = getTimes()
    const [result]: any = await pool.query(
      'INSERT INTO user_otps (user_id, type, otp, expired_at, created_at) VALUES (?, ?, ?, ?, ?)',
      [data.user_id, data.type, data.otp, data.expired_at, now]
    );
    return result.insertId;
  }
}
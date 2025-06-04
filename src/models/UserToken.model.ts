import pool from "@/db";
import { getTimes } from "@/helpers";

export interface UserToken {
  id: number;
  user_id: number;
  token: string;
  refresh_token: string;
  expires_at: Date;
  country?: string;
  state?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  ip?: string;
  device_model?: string;
  os?: string;
  os_version?: string;
  timezone?: string;
  language?: string;
}

export class UserTokenModel {
  static async create(data: Omit<UserToken, 'id'>): Promise<number> {
    const now = getTimes()
    const [result]: any = await pool.query(
      'INSERT INTO user_tokens (user_id, token, refresh_token, expires_at, country, state, city, latitude, longitude, ip, device_model, os, os_version, timezone, language, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [data.user_id, data.token, data.refresh_token, data.expires_at, data.country, data.state, data.city, data.latitude, data.longitude, data.ip, data.device_model, data.os, data.os_version, data.timezone, data.language, now]
    );
    return result.insertId;
  }

  static async findByUserId(user_id: number): Promise<UserToken | null> {
    const [rows] = await pool.query('SELECT a.id, a.user_id, a.token, a.refresh_token, a.expires_at FROM user_tokens AS a WHERE a.user_id = ? LIMIT 1', [user_id]);
    const tokens = rows as UserToken[];
    return tokens.length ? tokens[0] : null;
  }

  static async findByToken(token: string): Promise<UserToken | null> {
    const [rows] = await pool.query('SELECT a.id, a.user_id, a.token, a.refresh_token, a.expires_at FROM user_tokens AS a WHERE a.token = ? LIMIT 1', [token]);
    const tokens = rows as UserToken[];
    return tokens.length ? tokens[0] : null;
  }

  static async deleteByUserIdAndToken(user_id: number, token: string): Promise<void> {
    await pool.query('DELETE FROM user_tokens WHERE user_id = ? AND token = ?', [user_id, token]);
  }
}
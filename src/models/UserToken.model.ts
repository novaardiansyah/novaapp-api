import pool from "@/db"
import { getTimes } from "@/helpers"

const QUERY_DEBUG = process.env.QUERY_DEBUG === 'true'

export interface UserToken {
  id: number
  user_id: number
  token: string
  refresh_token: string
  expires_at: Date
  country?: string
  state?: string
  city?: string
  latitude?: string
  longitude?: string
  ip?: string
  device_model?: string
  os?: string
  os_version?: string
  timezone?: string
  language?: string
}

export class UserTokenModel {
  static async create(data: Omit<UserToken, 'id'>): Promise<number> {
    const now = getTimes()
    
    const dataMap: Record<string, any> = {
      user_id: data.user_id,
      token: data.token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      country: data.country,
      state: data.state,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      ip: data.ip,
      device_model: data.device_model,
      os: data.os,
      os_version: data.os_version,
      timezone: data.timezone,
      language: data.language,
      created_at: now,
      updated_at: now,
    }
    
    const fields = Object.keys(dataMap)
    const values = Object.values(dataMap)
    const sql    = pool.format(`INSERT INTO user_tokens (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, values)
    QUERY_DEBUG && console.log('SQL:', sql)

    const [result]: any = await pool.query(sql)
    return result.insertId
  }

  static async findByToken(token: string): Promise<UserToken | null> {
    const sql = pool.format('SELECT a.id, a.user_id, a.token, a.refresh_token, a.expires_at FROM user_tokens AS a WHERE a.token = ? AND a.deleted_at IS NULL LIMIT 1', [token])
    QUERY_DEBUG && console.log('SQL:', sql)

    const [rows] = await pool.query(sql)
    const tokens = rows as UserToken[]

    return tokens.length ? tokens[0] : null
  }

  static async deleteByUserIdAndToken(user_id: number, token: string): Promise<void> {
    const sql = pool.format('UPDATE user_tokens SET deleted_at = ? WHERE user_id = ? AND token = ?', [getTimes(), user_id, token])
    QUERY_DEBUG && console.log('SQL:', sql)
    await pool.query(sql)
  }
}
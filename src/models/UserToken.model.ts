import pool from "@/db"
import { getTimes } from "@/helpers"

const QUERY_DEBUG = process.env.QUERY_DEBUG === 'true'

export interface UserToken {
  id: number
  user_id: number
  token: string
  refresh_token: string
  expires_at: Date
  refresh_token_expires_at: Date,
  country?: string | null
  country_flag?: string | null
  city?: string | null
  state?: string | null
  district?: string | null
  zipcode?: string | null
  latitude?: string | null
  longitude?: string | null
  ip?: string
  updated_at?: Date
}

export class UserTokenModel {
  static async create(data: Omit<UserToken, 'id'>): Promise<number> {
    const now = getTimes()
    
    const dataMap: Record<string, any> = {
      user_id: data.user_id,
      token: data.token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      refresh_token_expires_at: data.refresh_token_expires_at,
      country: data.country,
      country_flag: data.country_flag,
      city: data.city,
      state: data.state,
      district: data.district,
      zipcode: data.zipcode,
      latitude: data.latitude,
      longitude: data.longitude,
      ip: data.ip,
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
    const sql = pool.format('SELECT a.id, a.user_id, a.token, a.refresh_token, a.expires_at, a.refresh_token_expires_at FROM user_tokens AS a WHERE a.token = ? AND a.deleted_at IS NULL LIMIT 1', [token])
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

  static async findByIdAndUserId(id: number, user_id: number): Promise<UserToken | null> {
    const sql = pool.format('SELECT a.id, a.user_id, a.token, a.refresh_token, a.expires_at, a.refresh_token_expires_at FROM user_tokens AS a WHERE a.id = ? AND a.user_id = ? AND a.deleted_at IS NULL LIMIT 1', [id, user_id])
    QUERY_DEBUG && console.log('SQL:', sql)

    const [rows] = await pool.query(sql)
    const tokens = rows as UserToken[]

    return tokens.length ? tokens[0] : null
  }

  static async updateById(id: number, data: Partial<UserToken>): Promise<void> {
    data.updated_at = new Date(getTimes())

    const sql = pool.format(`UPDATE user_tokens SET ? WHERE id = ?`, [data, id])
    QUERY_DEBUG && console.log('SQL:', sql)

    await pool.query(sql)
  }
}
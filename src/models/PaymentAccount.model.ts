import pool from '@/db'

const QUERY_DEBUG = process.env.QUERY_DEBUG === 'true'

export interface PaymentAccountData {
  id: number
  name: string
  deposit: number
  logo: string
  created_at: Date
  updated_at: Date
}

interface PaginateParams {
  page: number
  per_page: number
  search?: string
}

export class PaymentAccountModel {
  static async paginate(params: PaginateParams): Promise<{ data: PaymentAccountData[]; total: number }> {
    const offset = (params.page - 1) * params.per_page
    const values: any[] = []
    let where = ''
    
    if (params.search) {
      where = 'WHERE LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)'
      values.push(`%${params.search}%`, `%${params.search}%`)
    }

    // ! 1. Get total count
    const countSql = pool.format(`SELECT COUNT(*) as total FROM payment_accounts ${where}`, values)
    const [countRows] = await pool.query(countSql) as [Array<{ total: number }>, any]
    const total = countRows[0].total

    // ! 2. Get paginated data
    const dataSql = pool.format(`
      SELECT id, name, deposit, logo, created_at, updated_at
      FROM payment_accounts
      ${where}
      ORDER BY updated_at DESC
      LIMIT ?
      OFFSET ?
    `, [...values, params.per_page, offset])
    const [rows] = await pool.query(dataSql)
    
    QUERY_DEBUG && console.log('SQL:', dataSql)

    return { data: rows as PaymentAccountData[], total }
  }
}
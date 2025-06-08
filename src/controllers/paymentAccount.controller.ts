import { Handler, Request, Response } from 'express'
import { PaymentAccountModel } from '@/models'

export const PaymentAccount = {
  index: (async(req: Request, res: Response) => {
    let { page = 1, per_page = 10, search } = req.query
    search = search ? String(search) : ''

    page     = Number(page)
    per_page = Number(per_page)

    if (page < 1) page = 1
    if (per_page < 1 || per_page > 100) per_page = 10

    const notes = await PaymentAccountModel.paginate({ page, per_page, search })
    const total = notes.total
    
    let next_page: number | null = page + 1
    const total_pages = Math.ceil(total / per_page)

    if (next_page > total_pages) next_page = null

    res.json({
      current_page: page,
      next_page,
      per_page: per_page,
      total,
      data: notes.data,
    })

  }) as Handler,
}
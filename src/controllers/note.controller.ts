import { Handler, Request, Response } from 'express'
import { NoteModel } from '@/models/Note.model'

export const NoteController = {
  index: (async(req: Request, res: Response) => {
    let { page = 1, per_page = 10 } = req.query

    page     = Number(page)
    per_page = Number(per_page)

    if (per_page < 1 || per_page > 100) per_page = 10

    const notes = await NoteModel.paginate({ page, per_page, })
    const total = await NoteModel.total()
    
    let next_page: number | null = page + 1
    const total_pages = Math.ceil(total / per_page)

    if (next_page > total_pages) next_page = null

    res.json({
      current_page: page,
      next_page,
      per_page: per_page,
      total,
      data: notes,
    })

  }) as Handler,

  show: (async(req: Request, res: Response) => {
    const id = Number(req.params.id)
    const note = await NoteModel.findById(id)

    if (!note) return res.status(404).json({ error: 'Data not found' })

    res.json({ data: note })
  }) as Handler,

  update: (async(req: Request, res: Response) => {
    const id = Number(req.params.id)
    const note = await NoteModel.findById(id)
    
    if (!note) return res.status(404).json({ error: 'Data not found' })
    
    const { title, description } = req.body

    await NoteModel.update(id, { title, description })

    res.json({ message: 'Data updated successfully' })
  }) as Handler,
}
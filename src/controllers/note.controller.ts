import { Handler, Request, Response } from 'express'
import { NoteModel } from '@/models/Note.model'

export const NoteController = {
  index: (async(req: Request, res: Response) => {
    let { page = 1, per_page = 10, search } = req.query
    search = search ? String(search) : ''

    page     = Number(page)
    per_page = Number(per_page)

    if (per_page < 1 || per_page > 100) per_page = 10

    const notes = await NoteModel.paginate({ page, per_page, search })
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

  store: (async(req: Request, res: Response) => {
    const { title, description } = req.body

    await NoteModel.create({ title, description })

    res.status(201).json({ message: 'Note created successfully' })
  }) as Handler,

  delete: (async(req: Request, res: Response) => {
    const id = Number(req.params.id)
    const note = await NoteModel.findById(id)

    if (!note) return res.status(404).json({ error: 'Data not found' })
    await NoteModel.delete(id)
    
    res.json({ message: 'Data deleted successfully' })
  }) as Handler,
}
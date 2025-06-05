import { Router } from 'express'
import { NoteController } from '@/controllers/note.controller'
import { auth, validate } from '@/middlewares'
import { updateSchema, createSchema } from '@/schemas/notes'

const router = Router()

router.get('/', NoteController.index)
router.post('/', validate(createSchema), NoteController.store)
router.get('/:id', auth({}), NoteController.show)
router.delete('/:id', NoteController.delete)
router.put('/:id', auth({}), validate(updateSchema), NoteController.update)

export default router
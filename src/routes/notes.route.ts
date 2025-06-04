import { Router } from 'express'
import { NoteController } from '@/controllers/note.controller'
import { validate } from '@/middlewares'
import { updateSchema } from '@/schemas/notes'

const router = Router()

router.get('/', NoteController.index)
router.get('/:id', NoteController.show)
router.put('/:id', validate(updateSchema), NoteController.update)

// Route::get('/{id}', [NoteController::class, 'show'])
// Route::put('/{id}', [NoteController::class, 'update'])

export default router
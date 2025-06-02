import { Router } from 'express';
import { NoteController } from '@/controllers/note.controller';

const router = Router();

router.get('/', NoteController.index);

export default router
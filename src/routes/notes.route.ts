import { Router } from 'express';
import { NotesController } from '@/controllers/notes.controller';

const router = Router();

router.get('/', NotesController.index);

export default router
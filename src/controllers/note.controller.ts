  import { Request, Response } from 'express';
  import { NoteModel } from '@/models/Note.model';
  
  export const NoteController = {
    async index(req: Request, res: Response) {
      const notes = await NoteModel.all();
      res.json(notes);
    },
  };
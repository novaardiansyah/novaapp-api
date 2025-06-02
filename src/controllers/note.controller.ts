  import { Request, Response } from 'express';
  import { NotesModel } from '@/models/notes.model';
  
  export const NoteController = {
    async index(req: Request, res: Response) {
      const notes = await NotesModel.all();
      res.json(notes);
    },
  };
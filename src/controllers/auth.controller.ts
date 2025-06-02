import { Request, Response } from 'express';
import { UsersModel } from '@/models/users.model';

export const AuthController = {
  async login(req: Request, res: Response) {
    res.json(['Login successful']);
  },
};
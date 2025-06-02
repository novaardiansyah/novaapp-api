import { Request, Response } from 'express';
import { UsersModel } from '@/models/users.model';

export const AuthController = {
  // ! Only for testing purposes, will be removed soon
  async index(req: Request, res: Response) {
    const result = await UsersModel.all();
    res.json(result);
  },
};
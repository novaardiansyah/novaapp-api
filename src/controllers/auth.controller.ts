import { Request, Response, Handler } from 'express'
import { UsersModel } from '@/models/users.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const AuthController = {
  async index(req: Request, res: Response) {
    res.json(['Login successful']);
  },

  login: (async(req: Request, res: Response) => {
    const { email, password } = req.body || {}

    if (!email || !password)
      return res.status(422).json({ message: 'Email and password required' })

    const user = await UsersModel.findByEmail(email)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ token })
  }) as Handler,

  register: (async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password)
      return res.status(422).json({ message: 'Email and password are required' });

    let newName = name?.trim();

    if (!name) 
      newName = email.split('@')[0];

    const existing = await UsersModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const userId = await UsersModel.create({ email, password: hash, name: newName });
    const user = await UsersModel.findById(userId);

    res.status(201).json({ user: { id: user?.id, email: user?.email, name: user?.name } });
  }) as Handler,

  me: (async (req: Request, res: Response) => {
    res.json({
      id: (req as any).user.userId,
      email: (req as any).user.email,
      name: (req as any).user.name
    });
  }) as Handler
}
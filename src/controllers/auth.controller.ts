import { Request, Response, Handler } from 'express'
import { UsersModel, UserTokensModel } from '@/models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateRefreshToken, getTimes } from '@/helpers';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const AuthController = {
  async index(req: Request, res: Response) {
    res.json(['Login successful']);
  },

  login: (async(req: Request, res: Response) => {
    const { email, password } = req.body || {}

    const user = await UsersModel.findByEmail(email)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const expiresIn = getTimes({ day: 1 })
    const refreshToken = await generateRefreshToken()

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    await UserTokensModel.create({
      user_id: user.id,
      token: token,
      refresh_token: refreshToken.hash,
      expires_at: new Date(expiresIn),
      country: 'Indonesia',
      state: 'DKI Jakarta',
      city: 'Jakarta',
      ip: req.ip,
      device_model: req.headers['user-agent'] || 'Unknown',
      os: 'Unknown',
      os_version: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: req.headers['accept-language']?.split(',')[0] || 'en-US',
    })
    
    res.json({
      token,
      refreshToken: refreshToken.plain,
      expiresIn,
    })
  }) as Handler,

  register: (async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    let newName = name?.trim();

    if (!name) 
      newName = email.split('@')[0];
    
    const existing = await UsersModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email telah terdaftar sebelumnya.' })

    const hash = await bcrypt.hash(password, 10);
    const userId = await UsersModel.create({ email, password: hash, name: newName });
    const user = await UsersModel.findById(userId);

    res.status(201).json(user);
  }) as Handler,

  me: (async (req: Request, res: Response) => {
    res.json({
      id: (req as any).user.userId,
      email: (req as any).user.email,
      name: (req as any).user.name
    });
  }) as Handler
}
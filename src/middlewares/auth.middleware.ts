import { UserTokensModel } from '@/models'
import { Handler } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

export interface JwtPayload {
  userId: number
  email: string
  name: string
  iat: number
  exp: number
}

export const auth: Handler = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid token' })
    return
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
    (req as any).user = payload

    const { userId } = payload
    const userToken = await UserTokensModel.findByUserId(userId)

    if (!userToken || userToken.token !== token) {
      throw new Error('Token does not match user token')
    }

    if (new Date(userToken.expires_at) < new Date()) {
      throw new Error('Token has expired')
    }

    next()
  } catch (err) {
    res.status(401).json({ message: err instanceof Error ? err.message : 'Unauthorized' })
  }
}
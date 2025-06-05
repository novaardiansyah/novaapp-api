import { UserTokenModel } from '@/models'
import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

export interface JwtPayload {
  userId: number
  email: string
  name: string
  iat: number
  exp: number
}

interface AuthParams {
  onRefresh?: boolean
}

export function auth(params: AuthParams): RequestHandler {
  return async (req, res, next): Promise<void> => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Missing or invalid token' })
      return
    }

    const token = authHeader.split(' ')[1]

    try {
      let payload: JwtPayload

      if (params.onRefresh) {
        payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as JwtPayload
      } else {
        payload = jwt.verify(token, JWT_SECRET) as JwtPayload
      }

      const { userId } = payload
      const userToken = await UserTokenModel.findByToken(token)
      
      if (!userToken || userToken.user_id !== userId) {
        throw new Error('Token does not match user token')
      }

      if (!params.onRefresh && new Date(userToken.expires_at) < new Date()) {
        throw new Error('Token has expired')
      }


      (req as any).user = { ...payload, token_id: userToken.id }

      next()
    } catch (err) {
      res.status(401).json({ message: err instanceof Error ? err.message : 'Unauthorized' })
    }
  }
}
import { Router } from 'express'
import { AuthController } from '@/controllers/auth.controller'

import { validate, auth } from '@/middlewares'
import { loginSchema, registerSchema, refreshTokenSchema } from '@/schemas/auth'

const router = Router()

router.post('/register', validate(registerSchema), AuthController.register)
router.get('/me', auth({}), AuthController.me)
router.post('/login', validate(loginSchema), AuthController.login)
router.post('/logout', auth({}), AuthController.logout)
router.post('/refresh-token', auth({ onRefresh: true }), validate(refreshTokenSchema), AuthController.refreshToken)

export default router
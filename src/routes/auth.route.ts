import { Router } from 'express'
import { AuthController } from '@/controllers/auth.controller'

import { validate, auth } from '@/middlewares'
import { loginSchema, registerSchema } from '@/schemas/auth'

const router = Router()

router.post('/register', validate(registerSchema), AuthController.register)
router.get('/me', auth, AuthController.me)
router.post('/login', validate(loginSchema), AuthController.login)
router.post('/logout', auth, AuthController.logout)

export default router
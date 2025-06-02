import { Router } from 'express'
import { AuthController } from '@/controllers/auth.controller'

import { validate, auth } from '@/middlewares'
import { loginSchema } from '@/routes/schemas/auth'

const router = Router()

router.post('/register', AuthController.register)
router.get('/me', auth, AuthController.me)
router.post('/login', validate(loginSchema), AuthController.login)

export default router
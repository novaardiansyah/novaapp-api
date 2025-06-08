import { Router } from 'express'
import { PaymentAccount } from '@/controllers'
import { auth } from '@/middlewares'

const router = Router()

router.get('/', auth(), PaymentAccount.index)

export default router
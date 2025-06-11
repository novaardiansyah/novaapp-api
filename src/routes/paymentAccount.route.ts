import { Router } from 'express'
import { PaymentAccount } from '@/controllers'
import { auth, validate } from '@/middlewares'
import { createSchema } from '@/schemas/paymentAccount'

const router = Router()

router.get('/', auth(), PaymentAccount.index)
router.post('/', auth(), validate(createSchema), PaymentAccount.store)

export default router
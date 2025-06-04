import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string({ message: 'Email wajib diisi.' }).email({ message: "Email tidak valid." }),
  password: z.string({ message: 'Password wajib diisi.' }).min(6, { message: "Password minimal 6 karakter." }),
  ip: z.string().optional(),
})

export const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string({ message: 'Email wajib diisi.' }).email({ message: "Email tidak valid." }),
  password: z.string({ message: 'Password wajib diisi.' }).min(6, { message: "Password minimal 6 karakter." }),
})
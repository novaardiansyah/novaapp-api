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

export const refreshTokenSchema = z.object({
  refresh_token: z.string({ message: 'Refresh Token wajib diisi.' }).min(1, { message: "Refresh Token wajib diisi." }),
})
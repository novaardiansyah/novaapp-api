import { z } from 'zod'

export const createSchema = z.object({
  name: z.string({ message: 'Nama akun wajib diisi.' }).min(1, { message: 'Nama akun wajib diisi.' }).max(120, { message: "Nama Akun maksimal 120 karakter." }),
  deposit: z.number({ message: 'Deposit wajib di isi hanya dengan angka.' })
})
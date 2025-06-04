import { z } from 'zod'

export const createSchema = z.object({
  title: z.string({ message: 'Judul wajib diisi.' }).min(1, { message: 'Judul wajib diisi.' }).max(255, { message: "Judul maksimal 255 karakter." }),
  description: z.string({ message: 'Keterangan wajib diisi.' }).min(1, { message: 'Keterangan wajib diisi.' }).max(6000, { message: "Keterangan maksimal 6000 karakter." }),
})

export const updateSchema = z.object({
  title: z.string({ message: 'Judul wajib diisi.' }).min(1, { message: 'Judul wajib diisi.' }).max(255, { message: "Judul maksimal 255 karakter." }),
  description: z.string({ message: 'Keterangan wajib diisi.' }).min(1, { message: 'Keterangan wajib diisi.' }).max(6000, { message: "Keterangan maksimal 6000 karakter." }),
})
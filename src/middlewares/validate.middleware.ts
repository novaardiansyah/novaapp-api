import type { RequestHandler } from "express"
import type { ZodSchema, TypeOf } from "zod"

export function validate<T extends ZodSchema<any>>(schema: T): RequestHandler {
  return (req, res, next): void => {
    if (!req.body) {
      res.status(400).json({ message: "You must provide a request body." })
      return
    }

    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors: Record<string, string[]> = {}

      for (const err of result.error.errors) {
        const key = err.path.join(".")
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key].push(err.message)
      }

      res.status(422).json({
        message: Object.values(errors)[0]?.[0] || "Invalid request data",
        errors,
      })

      return
    }
    
    req.body = result.data as TypeOf<T>
    next()
  }
}
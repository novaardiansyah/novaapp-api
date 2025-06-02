import type { RequestHandler } from "express"
import type { ZodSchema, TypeOf } from "zod"

export function validate<T extends ZodSchema<any>>(schema: T): RequestHandler {
  return (req, res, next): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      let errors = result.error.errors.map((err) => ({
        [err.path.join(".")]: err.message,
      }));

      res.status(422).json({
        message: errors[0]?.[Object.keys(errors[0])[0]] || "Invalid request data",
        errors,
      })

      return
    }
    
    req.body = result.data as TypeOf<T>
    next()
  }
}
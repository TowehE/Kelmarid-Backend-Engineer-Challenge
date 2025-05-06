import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidationException } from 'App/Exceptions/Handler'

// Utilia function to check for extra fields in request body
export function validateExtraFields(ctx: HttpContextContract, allowedFields: string[]): void {
  const requestFields = Object.keys(ctx.request.body() || {})
  const extraFields = requestFields.filter(field => !allowedFields.includes(field))

  if (extraFields.length > 0) {
    throw new ValidationException(`Invalid field: ${extraFields.join(', ')}`)
  }
}
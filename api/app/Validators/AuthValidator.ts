import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validateExtraFields } from 'App/Utils/ValidationUtils'

export  class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {
    const allowedFields = [ 'username', 'password']
      validateExtraFields(ctx, allowedFields)

  }

  public schema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ 
          table: 'users', 
          column: 'username',
          caseInsensitive: true,
        }),
        rules.minLength(3),
      ]),
       password: schema.string({}, [rules.minLength(6)]),
        })

      

  public messages: CustomMessages = {
    'username.required': 'Username is required',
    'username.unique': 'Username already taken',
    'username.minLength': 'Username must be at least 3 characters',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 6 characters',


  }

}

export class LoginValidator {
  constructor(protected ctx: HttpContextContract) {
    // Validate no extra fields are present
    const allowedFields = ['username', 'password']
    validateExtraFields(ctx, allowedFields)
  }

  public schema = schema.create({
    username: schema.string({ trim: true }),
    password: schema.string(),
  })

  public messages: CustomMessages = {
    'username.required': 'Username is required',
    'password.required': 'Password is required',
  }
}
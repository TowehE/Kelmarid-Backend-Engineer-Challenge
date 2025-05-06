import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validateExtraFields } from 'App/Utils/ValidationUtils'

export  class CreateAuthorValidator  {
  constructor(protected ctx: HttpContextContract) {
    const allowedFields= [ 'name' ]
    validateExtraFields(ctx, allowedFields)
  }

  public schema = schema.create({
    name: schema.string({ trim:true },[
      rules.minLength(3),
    ])
  })

  public messages: CustomMessages = {
    'name.required': 'Author name is required',
    'name.minLength': 'Author name must be at least 2 characters',
    
  }

}


export  class EditAuthorValidator   {
  constructor(protected ctx: HttpContextContract) {
    const allowedFields= [ 'name' ]
    validateExtraFields(ctx, allowedFields)
  }

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(2),
    ]),
  })

  public messages: CustomMessages = {
    'name.required': 'Author name is required',
    'name.minLength': 'Author name must be at least 2 characters',
  }
}


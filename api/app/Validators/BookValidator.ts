import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validateExtraFields } from 'App/Utils/ValidationUtils'


export  class CreateBookValidator  {
  constructor(protected ctx: HttpContextContract) {
    const allowedFields= [ 'name', 'pages' ]
    validateExtraFields(ctx, allowedFields)
  }

  
    public schema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(2)]),
      pages: schema.number([rules.unsigned()]),
    })
  
    public messages :CustomMessages = {
      'name.required': 'Book name is required',
      'name.minLength': 'Book name must be at least 2 characters',
      'pages.required': 'Page numbers is required',
      'pages.unsigned': 'Page numbers must be positive',
    }
  }



  export class UpdateBookValidator {
    constructor(protected ctx: HttpContextContract) {}
  
    public schema = schema.create({
      name: schema.string.optional({ trim: true }, [rules.minLength(2)]),
    })
  
    public messages: CustomMessages = {
      'name.minLength': 'Book name must be at least 2 characters',

    }
  }
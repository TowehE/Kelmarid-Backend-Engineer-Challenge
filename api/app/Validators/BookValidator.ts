import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateBookValidator {
  constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(2)]),
      pages: schema.number([rules.unsigned()]),
      authorIds: schema.array([
        rules.minLength(1)
      ])
      .members(schema.number([
        rules.exists({ table: 'authors', column: 'id' })
      ])),
    })
  
    public messages :CustomMessages = {
      'name.required': 'Book name is required',
      'name.minLength': 'Book name must be at least 2 characters',
      'pages.required': 'Page numbers is required',
      'pages.unsigned': 'Page numbers must be positive',
      'authorIds.required': 'At least one author is required',
      'authorIds.*.exists': 'Author does not exist',
      'authorIds.minLength': 'At least one author is required'
    }
  }



  export class UpdateBookValidator {
    constructor(protected ctx: HttpContextContract) {}
  
    public schema = schema.create({
      name: schema.string.optional({ trim: true }, [rules.minLength(2)]),
      pages: schema.number.optional([rules.unsigned()]),
      authorIds: schema.array.optional().members(schema.number([
        rules.exists({ table: 'authors', column: 'id' })
      ])),
    })
  
    public messages: CustomMessages = {
      'name.minLength': 'Book name must be at least 2 characters',
      'pages.unsigned': 'Page numbers must be positive',
      'authorIds.*.exists': 'Author does not exist',
    }
  }
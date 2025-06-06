/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.status(401).json({
        message: 'Session timeout. Please login again.'
      })
    }

    return super.handle(error, ctx)
  }
}



export class ValidationException extends Exception {
  constructor(message: string) {
    super(message, 400)
  }
  
  public async handle(error: this, { response }) {
    response.status(error.status).send({
      message: error.message
    })
  }
}

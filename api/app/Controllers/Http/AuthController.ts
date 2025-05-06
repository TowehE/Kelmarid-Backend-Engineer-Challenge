import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import {RegisterValidator, LoginValidator } from 'App/Validators/AuthValidator'


export default class AuthController {
  
public async register({ request, response}: HttpContextContract) {
  const payload = await request.validate(RegisterValidator)

 const existingUser = await User.query()
        .whereRaw('LOWER(username) = LOWER(?)', [payload.username])
        .first()
      
      if (existingUser) {
        return response.conflict({
          message: 'Username already taken'
        })
      }
const user = await User.create(payload)
   
return response.created({
  message: 'User created successfully',
  user: {
    id:user.id,
    username: user.username

  },
})
}


public async login({ request, response, auth }: HttpContextContract) {
  const { username, password } = await request.validate(LoginValidator)

  console.log('Password from request:', password); // Log the password from the request

  const user = await User.query()
    .whereRaw('LOWER(username) = LOWER(?)', [username])
    .first()

  if (!user) {
    return response.unauthorized({ message: 'Username is not registered' })
  }

 
  // Verify password
  const isPasswordValid = await Hash.verify(user.password, password)

 
  if (!isPasswordValid) {
    return response.unauthorized({ message: 'Invalid password' })
  }

  // Generate API token
  const token = await auth.use('api').login(user, {
    name: 'api_token',
    expiresIn: '5 days',
  })

  return response.ok({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
    },
    token: token
  })
}




public async logout({ response, auth }: HttpContextContract) {
  const token = auth.use('api').token
  const user = auth.use('api').user

  console.log('Token:', token)
  console.log('User:', user)


  
    if (user && token) {
      await auth.use('api').revoke()
      return response.ok({ message: 'Logout successful' })
    } else {
      return response.unauthorized({ message: 'No user or token found' })
    }
  }



}
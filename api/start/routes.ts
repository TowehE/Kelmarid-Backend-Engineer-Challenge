/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// public routes
Route.group(() => {
  // User authentication routes
  Route.post('/createuser', 'AuthController.register')
  Route.post('/login', 'AuthController.login')

  Route.get('/hello', async ({ response }) => {
    return response.status(200).json({ hello: 'world' })
  })
}).prefix('api')

// Root route 
Route.get('/', async ({ response }) => {
  return response.status(200).json({ hello: 'world' })
})
// protected routes
Route.group(() => {
  // Auth routes
  Route.post('/logout', 'AuthController.logout')

  // Author routes
   Route.resource('authors', 'AuthorsController').apiOnly()

  //  Book routes
  Route.resource('books', 'BooksController').apiOnly()

})
  .prefix('api')
  .middleware('auth:api')
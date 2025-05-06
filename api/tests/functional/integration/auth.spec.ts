import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

test.group('Authentication', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should register a new user', async ({ client, assert }) => {
    const response = await client
      .post('/api/createuser')
      .form({ 
        username: 'testuser',
        password: 'Password123@',
      })
   
    response.assertStatus(201)
    assert.equal(response.body().user.username, 'testuser')
    assert.exists(response.body().message)
  })

  test('should login a user and return token', async ({ client, assert }) => {
    // Create a user with the factory
    const user = await UserFactory.merge({ password: 'Password123@' }).create()

    const response = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@', 
      })

    response.assertStatus(200)
    assert.exists(response.body().token)
    assert.exists(response.body().token.token)
    assert.equal(response.body().user.username, user.username)
  })

  test('should not login with invalid credentials', async ({ client }) => {
    const response = await client
      .post('/api/login')
      .form({
        username: 'nonexistent',
        password: 'Wrongpassword@',
      })

    response.assertStatus(401)
  })
})

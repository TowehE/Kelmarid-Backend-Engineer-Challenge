import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
// import { UserFactory } from 'Database/factories'

test.group('Authentication', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  
  test('should register a new user', async ({ client, assert }) => {
    const response = await client
      .post('/api/register')
      .form({
        username: 'testuser',
        password: 'password123',
      })
    
    response.assertStatus(201)
    assert.equal(response.body().user.username, 'testuser')
    assert.exists(response.body().message)
  })
  
  test('should login a user and return token', async ({ client, assert }) => {
    // Create a user first
    await client
      .post('/api/register')
      .form({
        username: 'loginuser',
        password: 'password123',
      })
    
    // Try to login
    const response = await client
      .post('/api/login')
      .form({
        username: 'loginuser',
        password: 'password123',
      })
    
    response.assertStatus(200)
    assert.exists(response.body().token)
    assert.exists(response.body().token.token)
    assert.equal(response.body().user.username, 'loginuser')
  })
  
  test('should not login with invalid credentials', async ({ client }) => {
    const response = await client
      .post('/api/login')
      .form({
        username: 'nonexistent',
        password: 'wrongpassword',
      })
    
    response.assertStatus(401)
  })
})
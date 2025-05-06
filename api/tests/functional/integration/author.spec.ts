import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories/index'
// import { AuthorFactory } from 'Database/factories/index'

test.group('Authors Controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  let token: string

  test('should create a new author', async ({ client, assert }) => {

    const user = await UserFactory.create()
    const loginResponse = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = loginResponse.body().token.token

    // Create author data
    const authorName = 'Test Author Name'

    // Test creating an author
    const response = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: authorName,
      })

    response.assertStatus(201)
    assert.equal(response.body().data.name, authorName)
    assert.exists(response.body().message)
    })

  test('should not create author with duplicate name for same user', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author
    const authorName = 'Duplicate Test Author'
    
    // Create first author
    await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: authorName,
      })

    // Try to create with the same name
    const response = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: authorName,
      })

    response.assertStatus(409) 
    assert.exists(response.body().message)
  })

  test('should not create author without authentication', async ({ client }) => {
    const response = await client
      .post('/api/authors')
      .form({
        name: 'Unauthorized Author',
      })

    response.assertStatus(401)
   
  })

  test('should retrieve an author by id', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author through API
    const createResponse = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Retrievable Author',
      })

    const authorId = createResponse.body().data.id

    // Get the author
    const response = await client
      .get(`/api/authors/${authorId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.name, 'Retrievable Author')
    assert.equal(response.body().data.id, authorId)
  })

  test('should return 404 for non-existent author', async ({ client }) => {
    // Create a fresh token for this test
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    const testToken = login.body().token.token

    const response = await client
      .get('/api/authors/999999')
      .header('Authorization', `Bearer ${testToken}`)
    response.assertStatus(404)

  })

  test('should list authors with pagination', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Createe  multiple authors
    for (let i = 1; i <= 5; i++) {
      await client
        .post('/api/authors')
        .header('Authorization', `Bearer ${token}`)
        .form({
          name: `Paginated Author ${i}`,
        })
    }

    // Get authors with pagnation
    const response = await client
      .get('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .qs({
        page: 1,
        limit: 3,
      })

    response.assertStatus(200)
    assert.exists(response.body().data.data)
    assert.exists(response.body().data.meta)
    assert.equal(response.body().data.meta.per_page, 3)
  })

  test('should search authors by name', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author
    const uniqueName = 'Unique Searchable Author Name'
    await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: uniqueName,
      })

    // Search for the author
    const response = await client
      .get('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .qs({
        search: uniqueName,
      })

    response.assertStatus(200)
    assert.exists(response.body().data.data)
    //Find me one author at least
    assert.isAtLeast(response.body().data.data.length, 1)

  })

  test('should update an author', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author through API first
    const createResponse = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Author To Update',
      })

    const authorId = createResponse.body().data.id

    // Update the author
    const response = await client
      .put(`/api/authors/${authorId}`)
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Updated Author Name',
      })

    response.assertStatus(200)
    assert.equal(response.body().data.name, 'Updated Author Name')
    assert.equal(response.body().data.id, authorId)
  })

  test('should not update author with duplicate name', async ({ client }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create two authors
    const firstResponse = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'First Author',
      })

    await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Second Author',
      })

    const firstAuthorId = firstResponse.body().data.id

    // Try to update first author with second author's name
    const response = await client
      .put(`/api/authors/${firstAuthorId}`)
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Second Author',
      })

    response.assertStatus(409) 
  })

  test('should not update author without authentication', async ({ client }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author
    const createResponse = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Auth Protected Author',
      })

    const authorId = createResponse.body().data.id

    // Try to update without token
    const response = await client
      .put(`/api/authors/${authorId}`)
      .form({
        name: 'Should Not Update',
      })

    response.assertStatus(401)
   
  })

  test('should not update another user\'s author', async ({ client }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author as first user
    const createResponse = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'First User Author',
      })

    const authorId = createResponse.body().data.id

    // Login as second user
    const secondUser = await UserFactory.create()
    const secondLogin = await client
      .post('/api/login')
      .form({
        username: secondUser.username,
        password: 'Password123@',
      })

    const secondUserToken = secondLogin.body().token.token
    const response = await client
      .put(`/api/authors/${authorId}`)
      .header('Authorization', `Bearer ${secondUserToken}`)
      .form({
        name: 'Attempted Change',
      })

    response.assertStatus(403)
  })

  test('should delete an author', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author first
    const createResponse = await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Author To Delete',
      })

    const authorId = createResponse.body().data.id

    // Delete the author
    const delRes = await client
      .delete(`/api/authors/${authorId}`)
      .header('Authorization', `Bearer ${token}`)

    delRes.assertStatus(200)
    assert.exists(delRes.body().message)

    // Verify it's deleted
    const checkResponse = await client
      .get(`/api/authors/${authorId}`)
      .header('Authorization', `Bearer ${token}`)

    checkResponse.assertStatus(404)
  
  })
})
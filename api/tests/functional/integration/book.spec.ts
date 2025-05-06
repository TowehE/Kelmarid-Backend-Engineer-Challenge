import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory, AuthorFactory } from 'Database/factories/index'

test.group('Books Controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })


  let token: string

  test('should create a new book', async ({ client, assert }) => {

    const user = await UserFactory.create()
   
    await AuthorFactory
      .merge({ user_id: user.id })
      .create()

    const loginResponse = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = loginResponse.body().token.token


    // Create book data
    const bookName = 'Test Book Title'
    const bookPages = 250

    // Test creating a book
    const response = await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: bookName,
        pages: bookPages,
      })

    response.assertStatus(201)
    assert.equal(response.body().book.name, bookName)
    assert.equal(response.body().book.pages, bookPages)
    assert.exists(response.body().message)
   
  })

  test('should not create book without authentication', async ({ client }) => {
    const response = await client
      .post('/api/books')
      .form({
        name: 'Unauthorized Book',
        pages: 300,
      })

    response.assertStatus(401)
  
  })

  test('should retrieve a book by id', async ({ client, assert }) => {
    const user = await UserFactory.create()
   
    await AuthorFactory
      .merge({ user_id: user.id })
      .create()

    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create a book 
    const createResponse = await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Retrievable Book',
        pages: 420,
      })

    const bookId = createResponse.body().book.id

    // Get the book 
    const response = await client
      .get(`/api/books/${bookId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().name, 'Retrievable Book')
    assert.equal(response.body().pages, 420)
    assert.equal(response.body().id, bookId)
      })

  test('should return 404 for non-existent book', async ({ client }) => {
    // First get a valid token
    const user = await UserFactory.create()
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    const authToken = login.body().token.token
    
    const response = await client
      .get('/api/books/999999')
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(404)
  })

  test('should list books with pagination', async ({ client, assert }) => {
    const user = await UserFactory.create()

    await AuthorFactory
      .merge({ user_id: user.id })
      .create()

    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create multiple books
    for (let i = 1; i <= 5; i++) {
      await client
        .post('/api/books')
        .header('Authorization', `Bearer ${token}`)
        .form({
          name: `Paginated Book ${i}`,
          pages: 100 + i * 50,
        })
    }

    // Get books with pagination
    const response = await client
      .get('/api/books')
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

  test('should search books by name', async ({ client, assert }) => {
    const user = await UserFactory.create()
    // Create an author for the user 
    await AuthorFactory
      .merge({ user_id: user.id })
      .create()

    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create a book 
    const uniqueName = 'Unique Searchable Book Title'
    await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: uniqueName,
        pages: 350,
      })

    // Search for the book 
    const response = await client
      .get('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .qs({
        book_name: uniqueName,
      })

    response.assertStatus(200)
    assert.exists(response.body().data.data)
    assert.isAtLeast(response.body().data.data.length, 1)
  
  })

  test('should search books by author name', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const uniqueAuthorName = 'Unique Author For Book Search'
    
    // First create the user and login
    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create an author 
    await client
      .post('/api/authors')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: uniqueAuthorName,
      })

    // Create a book 
    await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Book with Searchable Author',
        pages: 500,
      })

    // Search for books by author name 
    const response = await client
      .get('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .qs({
        author_name: uniqueAuthorName,
      })

    response.assertStatus(200)
    assert.exists(response.body().data.data)
    assert.isAtLeast(response.body().data.data.length, 1)
  })

  test('should update a book', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await AuthorFactory
      .merge({ user_id: user.id })
      .create()

    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create a book first
    const createResponse = await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Book To Update',
        pages: 200,
      })

    const bookId = createResponse.body().book.id

    // Update the book
    const response = await client
      .put(`/api/books/${bookId}`)
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Updated Book Title',
    
      })

    response.assertStatus(200)
    assert.equal(response.body().book.name, 'Updated Book Title')
    // assert.equal(response.body().book.pages, 250)
    assert.equal(response.body().book.id, bookId)
  })

  test('should not update book without authentication', async ({ client }) => {
    const user = await UserFactory.create()
    // Create an author for the user - use the relation method
    await AuthorFactory
      .merge({ user_id: user.id })
      .create()

    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create a book
    const createResponse = await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Auth Protected Book',
        pages: 300,
      })

    const bookId = createResponse.body().book.id

    //  update without token
    const response = await client
      .put(`/api/books/${bookId}`)
      .form({
        name: 'Should Not Update',
        // pages: 400,
      })

    response.assertStatus(401)
  
  })

  test('should not update another user\'s book', async ({ client }) => {
    // Create first user and book
    const user1 = await UserFactory.create()
    // Create an author for the first user 
    await AuthorFactory
      .merge({ user_id: user1.id })
      .create()

    const login1 = await client
      .post('/api/login')
      .form({
        username: user1.username,
        password: 'Password123@',
      })

    const token1 = login1.body().token.token

    // Create a book as first user
    const createResponse = await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token1}`)
      .form({
        name: 'First User Book',
        pages: 250,
      })

    const bookId = createResponse.body().book.id

    // Create second user
    const user2 = await UserFactory.create()
    // Create an author for the second user
    await AuthorFactory
      .merge({ user_id: user2.id })
      .create()

    const login2 = await client
      .post('/api/login')
      .form({
        username: user2.username,
        password: 'Password123@', 
      })

    const token2 = login2.body().token.token

    // update first user book with second user's token
    const response = await client
      .put(`/api/books/${bookId}`)
      .header('Authorization', `Bearer ${token2}`)
      .form({
        name: 'Attempted Update By Other User',
        // pages: 300,
      })

    response.assertStatus(403) 
   
  })

  test('should delete a book', async ({ client, assert }) => {
    const user = await UserFactory.create()
    
    await AuthorFactory
      .merge({ user_id: user.id })
      .create()

    const login = await client
      .post('/api/login')
      .form({
        username: user.username,
        password: 'Password123@',
      })

    token = login.body().token.token

    // Create a book first
    const createResponse = await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token}`)
      .form({
        name: 'Book To Delete',
        pages: 180,
      })

    const bookId = createResponse.body().book.id

    // Delete the book
    const delRes = await client
      .delete(`/api/books/${bookId}`)
      .header('Authorization', `Bearer ${token}`)

    delRes.assertStatus(200)
    assert.exists(delRes.body().message)

    // Verify it's deleted 
    const checkResponse = await client
      .get(`/api/books/${bookId}`)
      .header('Authorization', `Bearer ${token}`)

    checkResponse.assertStatus(404)
   
  })

  test('should not delete another user\'s book', async ({ client }) => {
    // Create first user and book
    const user1 = await UserFactory.create()
    // Create an author for the first user 
    await AuthorFactory
      .merge({ user_id: user1.id })
      .create()

    const login1 = await client
      .post('/api/login')
      .form({
        username: user1.username,
        password: 'Password123@',
      })

    const token1 = login1.body().token.token

  
    const createResponse = await client
      .post('/api/books')
      .header('Authorization', `Bearer ${token1}`)
      .form({
        name: 'Book For Delete Test',
        pages: 220,
      })

    const bookId = createResponse.body().book.id

    // Create second user
    const user2 = await UserFactory.create()
    // Create an author for the second user 
    await AuthorFactory
      .merge({ user_id: user2.id })
      .create()

    const login2 = await client
      .post('/api/login')
      .form({
        username: user2.username,
        password: 'Password123@',
      })

    const token2 = login2.body().token.token
    const response = await client
      .delete(`/api/books/${bookId}`)
      .header('Authorization', `Bearer ${token2}`)

    response.assertStatus(403) 
   })
})
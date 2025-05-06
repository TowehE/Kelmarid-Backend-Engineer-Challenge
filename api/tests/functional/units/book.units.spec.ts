import { test } from '@japa/runner'
import sinon from 'sinon'
import BooksController from 'App/Controllers/Http/BooksController'
import Book from 'App/Models/Book'
import Author from 'App/Models/Author'

test.group('BooksController Tests', (group) => {
  group.each.teardown(() => {
    sinon.restore()
  })

  test('store should create a new book successfully', async ({ assert }) => {
    // Mock request with validation
    const request = {
      validate: sinon.stub().resolves({
        name: 'New Book',
        pages: 100,
      }),
      all: sinon.stub().returns({
        name: 'New Book',
        pages: 100,
      }),
    }

    // Mock response
    const response = {
      created: sinon.stub().returns('created_response'),
      unauthorized: sinon.stub().returns('unauthorized_response'),
    }
    
    // Mock auth
    const auth = { 
      user: { 
        id: 1 
      } 
    }

    // Mock date
    const now = new Date()
    
    // Mock author
    const author = {
      id: 5,
      name: 'Test Author',
      user_id: 1
    }
    
    // Mock Author.query chain
    const authorQueryStub = {
      where: sinon.stub().returnsThis(),
      first: sinon.stub().resolves(author)
    }
    sinon.stub(Author, 'query').returns(authorQueryStub as any)

    // Create book mock
    const book: any = {
      id: 1,
      name: 'New Book',
      pages: 100,
      user_id: 1,
      created_at: now,
      updated_at: now,
      related: sinon.stub().returns({
        attach: sinon.stub().resolves()
      }),
      load: sinon.stub()
    }
    
    // Set up the load method to return the book itself
    book.load.resolves(book)

    // Stub Book.create
    const createStub = sinon.stub(Book, 'create').resolves(book as any)

    // Create controller and call the method
    const controller = new BooksController()
    const result = await controller.store({ request, response, auth } as any)

    console.log('Response created arguments:', response.created.args)

    // Assertions
    assert.isTrue(createStub.calledOnce)
    assert.isTrue(authorQueryStub.where.calledWith('user_id', 1))
    assert.isTrue(book.related.calledWith('authors'))
    assert.isTrue(book.load.calledWith('authors'))
    
    // Check response formatting
    assert.isTrue(response.created.calledWithMatch({
      message: 'Book created successfully',
      book: sinon.match.object,
    }))

    assert.equal(result, 'created_response')
  })
})
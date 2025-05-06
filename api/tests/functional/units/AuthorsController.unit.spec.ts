import { test } from '@japa/runner'
import sinon from 'sinon'
import AuthorsController from 'App/Controllers/Http/AuthorsController'
import Author from 'App/Models/Author'

test.group('AuthorsController Tests', () => {
  

  test('store should return 409 when duplicate author name is found', async ({ assert }) => {
    const request = { 
      validate: sinon.stub().resolves({ name: 'Test Author' }) 
    }
    const response = { 
      conflict: sinon.stub().returns('conflict_response') 
    }
    const auth = { user: { id: 1 } }

    const existingAuthor = { id: 1, name: 'Test Author', user_id: 1 }

    const whereStub1 = sinon.stub().returns({
      where: sinon.stub().returns({
        first: sinon.stub().resolves(existingAuthor)
      })
    })
    
    const queryStub = sinon.stub(Author, 'query').returns({
      where: whereStub1
    })

    const controller = new AuthorsController()
    const result = await controller.store({ request, response, auth } as any)

    // Assertions
    assert.isTrue(response.conflict.calledWith({
      message: 'You have already created an author with this name.'
    }))
    
    assert.equal(result, 'conflict_response')

    assert.isTrue(queryStub.calledOnce)
    assert.isTrue(whereStub1.calledWith('user_id', 1))
    assert.isTrue(whereStub1().where.calledWith('name', 'Test Author'))
    assert.isTrue(whereStub1().where().first.calledOnce)
    sinon.restore()
  })


  test('update should return 404 if author is not found', async ({ assert }) => {
    const request = { validate: sinon.stub().resolves({ name: 'Updated Name' }) }
    const response = { notFound: sinon.stub().returns('not_found_response') }
    const auth = { user: { id: 1 } }

    
    const findStub = sinon.stub(Author, 'find').resolves(null)

    const controller = new AuthorsController()
    const result = await controller.update({ params: { id: 123 }, request, response, auth } as any)

    // Assertions
    assert.isTrue(findStub.calledWith(123))
    assert.isTrue(response.notFound.calledWith({
      message: 'Author not found'
    }))
    assert.equal(result, 'not_found_response')

    // Restore the stub after the test
    sinon.restore()
  })

  // Test for destroy method
  test('destroy should return 404 if author is not found', async ({ assert }) => {
    const response = { notFound: sinon.stub().returns('not_found_response') }
    const auth = { user: { id: 1 } }

    // Stub the find method to return null (author not found)
    const findStub = sinon.stub(Author, 'find').resolves(null)

    const controller = new AuthorsController()
    const result = await controller.destroy({ params: { id: 123 }, response, auth } as any)

    // Assertions
    assert.isTrue(findStub.calledWith(123))
    assert.isTrue(response.notFound.calledWith({
      message: 'Author not found'
    }))
    assert.equal(result, 'not_found_response')

    // Restore the stub after the test
    sinon.restore()
  })

 
  test('store should create a new author successfully', async ({ assert }) => {
    const request = { 
      validate: sinon.stub().resolves({ name: 'New Author' }) 
    }
    const response = { 
      created: sinon.stub().returns('created_response') 
    }
    const auth = { user: { id: 1 } }

    
    const firstStub = sinon.stub().resolves(null)
    const whereStub2 = sinon.stub().returns({ first: firstStub })
    const whereStub1 = sinon.stub().returns({ where: whereStub2 })
    const queryStub = sinon.stub(Author, 'query').returns({ where: whereStub1 })

   
    const createStub = sinon.stub(Author, 'create').resolves({
      id: 1, name: 'New Author', user_id: 1
    })

    const controller = new AuthorsController()
    const result = await controller.store({ request, response, auth } as any)

    // Assertions
    assert.isTrue(queryStub.calledOnce)
    assert.isTrue(whereStub1.calledWith('user_id', 1))
    assert.isTrue(whereStub2.calledWith('name', 'New Author'))
    assert.isTrue(firstStub.calledOnce)
    assert.isTrue(createStub.calledOnce)
    assert.isTrue(response.created.calledWith({
      message: 'Author created successfully',
      data: { id: 1, name: 'New Author', user_id: 1 },
    }))
    assert.equal(result, 'created_response')

    sinon.restore()
  })

})
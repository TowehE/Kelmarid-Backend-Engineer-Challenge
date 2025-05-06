import { test } from '@japa/runner'
import sinon from 'sinon'
import AuthController from 'App/Controllers/Http/AuthController'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('AuthController', () => {
  test('login should return token and user data if login is successful', async ({ assert }) => {
    const authStub = {
      use: sinon.stub().returns({
        login: sinon.stub().returns('fakeToken'), 
      }),
    }

    const user = {
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
    }

    const response = {
      ok: sinon.stub().returnsThis(),
      unauthorized: sinon.stub().returnsThis(),
    }

    const request = {
      validate: sinon.stub().returns({
        username: 'testuser',
        password: 'Password123!',
      }),
    }

    const userQueryStub = sinon.stub(User, 'query').returns({
      whereRaw: sinon.stub().returnsThis(),
      first: sinon.stub().resolves(user),
    })

    const hashVerifyStub = sinon.stub(Hash, 'verify').resolves(true)

    const controller = new AuthController()

    const result = await controller.login({
      request,
      response,
      auth: authStub as unknown as HttpContextContract['auth'],
    } as HttpContextContract)

    console.log('Result from login method (Successful login):', result)
    assert.isTrue(userQueryStub.calledOnce)
    assert.isTrue(hashVerifyStub.calledOnce)
    assert.isTrue(authStub.use().login.calledOnce)
    assert.isTrue(response.ok.calledWith({
      message: 'Login successful',
      user: { id: 1, username: 'testuser' },
      token: 'fakeToken',
    }))
  })

})

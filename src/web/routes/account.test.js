const { test } = require('test')

const build = require('web')
const database = require('lib/database')
const faker = require('faker')

test('route /account', async (t) => {
  t.plan(4)

  await database.migrate.latest()
  const app = await build()
  t.tearDown(() => app.close())

  const email = faker.internet.email()
  const username = faker.internet.userName()
  const password = faker.internet.password()

  await t.test('POST /', async (t) => {
    await t.test('invalid request', async (t) => {
      const response = await app.inject({
        method: 'POST',
        url: '/account',
      })

      t.match(response, {
        statusCode: 400,
        body: JSON.stringify({
          statusCode: 400,
          error: 'Bad Request',
          message: 'body should be object',
        }),
      })
    })

    await t.test('valid Request', async (t) => {
      const response = await app.inject({
        method: 'POST',
        url: '/account',
        body: {
          email,
          password,
          username,
        },
      })

      t.match(response, {
        statusCode: 302,
      })
    })
  })

  await t.test('GET /', async (t) => {
    await t.test('valid request', async (t) => {
      const response = await app.inject({
        method: 'get',
        url: '/account',
      })

      t.match(response, {
        statusCode: 200,
        body: JSON.stringify({
          view: 'account.pug',
        }),
      })
    })
  })

  await t.test('POST /signin', async (t) => {
    await t.test('invalid request', async (t) => {
      const response = await app.inject({
        method: 'POST',
        url: '/account/signin',
        body: {
          username: 'does-not-exist',
          password: 'bad-pass',
        },
      })

      t.match(response, {
        statusCode: 401,
        body: JSON.stringify({
          message: 'invalid credentials',
        }),
      })
    })

    await t.test('valid request', async (t) => {
      const response = await app.inject({
        method: 'POST',
        url: '/account/signin',
        body: {
          username,
          password,
        },
      })

      t.match(response, {
        statusCode: 200,
        cookies: [
          { name: 'token' },
        ],
        body: JSON.stringify({
          message: 'signed in',
        }),
      })

      const parsedToken = app.jwt.verify(response.cookies[0].value)
      t.match(parsedToken, { account: { username } })
    })
  })

  await t.test('GET /signout', async (t) => {
    await t.test('invalid request', async (t) => {
      const response = await app.inject({
        method: 'get',
        url: '/account/signout',
        cookies: {
          token: 'manipulated-jwt',
        },
      })

      t.match(response, {
        statusCode: 401,
        body: JSON.stringify({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Authorization token is invalid: jwt malformed',
        }),
      })
    })

    await t.test('valid request', async (t) => {
      const { cookies } = await app.inject({
        method: 'POST',
        url: '/account/signin',
        body: {
          username,
          password,
        },
      })

      const response = await app.inject({
        method: 'get',
        url: '/account/signout',
        cookies: {
          [cookies[0].name]: cookies[0].value,
        },
      })

      t.match(response, {
        statusCode: 200,
        cookies: [
          {
            name: 'token',
            value: '',
          },
        ],
        body: JSON.stringify({
          message: 'signed out',
        }),
      })
    })
  })

  t.end()
})

const { create, fetch, verifyPassword } = require('services/account')

const schemaResponse = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

const schemaAccount = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      username: { type: 'string' },
    },
    required: ['email', 'password', 'username'],
  },
  ...schemaResponse,
}

const schemaAuth = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['username', 'password'],
  },
  ...schemaResponse,
}

module.exports = async (app) => {
  app.get('/account', async (req, reply) => {
    return reply.send({
      view: 'account.pug',
    })
  })

  app.post('/account', { schema: schemaAccount }, async (req, reply) => {
    await create(req.body)

    reply.redirect('/account')
  })

  app.post('/account/signin', {
    schema: schemaAuth,
  }, async (req, reply) => {
    const { username, password } = req.body

    try {
      const account = await fetch({ username })

      await verifyPassword(account, password)

      const token = app.jwt.sign({ account })

      reply
        .setCookie('token', token, {
          path: '/',
        })
        .send({
          view: 'account.pug',
          message: 'signed in',
        })
    } catch (err) {
      app.log.error(err)

      // Generic error to avoid enumeration attack
      reply.status(401).send({
        message: 'invalid credentials',
      })
    }
  })

  app.get('/account/signout', {
    schema: schemaResponse,
    preValidation: [app.authenticate],
  }, (req, reply) => {
    reply.clearCookie('token', { path: '/' })

    reply.send({
      message: 'signed out',
    })
  })
}

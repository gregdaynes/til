const fastifyPlugin = require('fastify-plugin')
const jwt = require('fastify-jwt')

const { JWT_SECRET } = process.env

module.exports = fastifyPlugin(async (app) => {
  app.register(jwt, {
    secret: JWT_SECRET,
    cookie: { cookieName: 'token' },
  })

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})

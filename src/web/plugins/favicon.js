const fastifyNoIcon = require('fastify-no-icon')
const fastifyPlugin = require('fastify-plugin')

module.exports = fastifyPlugin(async (app) => {
  app.register(fastifyNoIcon)
})

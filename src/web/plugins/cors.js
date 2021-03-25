const fastifyCors = require('fastify-cors')
const fastifyPlugin = require('fastify-plugin')

module.exports = fastifyPlugin(async (app) => {
  app.register(fastifyCors, {})
})

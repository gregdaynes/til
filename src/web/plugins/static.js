const fastifyPlugin = require('fastify-plugin')
const fastifyStatic = require('fastify-static')
const path = require('path')

const { PUBLIC_DIR } = process.env

module.exports = fastifyPlugin(async (app) => {
  const root = path.join(__dirname, '..', PUBLIC_DIR)

  app.register(fastifyStatic, {
    root,
  })
})

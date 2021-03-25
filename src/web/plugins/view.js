const fastifyPlugin = require('fastify-plugin')
const path = require('path')
const pointOfView = require('point-of-view')
const pug = require('pug')

const { PAGES_DIR } = process.env

module.exports = fastifyPlugin(async (app) => {
  app.register(pointOfView, {
    root: path.join(__dirname, '..', PAGES_DIR),
    engine: {
      pug,
    },
  })
})

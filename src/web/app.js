require('module-alias/register')

const autoLoad = require('fastify-autoload')
const database = require('@database')
const fastify = require('fastify')
const path = require('path')

const { PLUGIN_DIR, ROUTES_DIR } = process.env

module.exports = async (opts) => {
  const app = fastify(opts)

  app.addHook('onClose', async () => {
    await database.destroy()
  })

  app.register(autoLoad, {
    dir: path.join(__dirname, PLUGIN_DIR),
    ignorePattern: /.*(test|spec).js/,
  })

  app.register(autoLoad, {
    dir: path.join(__dirname, ROUTES_DIR),
    ignorePattern: /.*(test|spec).js/,
  })

  return app
}

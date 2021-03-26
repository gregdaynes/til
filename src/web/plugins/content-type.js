const fastifyPlugin = require('fastify-plugin')

module.exports = fastifyPlugin(async (app) => {
  app.addHook('preSerialization', async (req, reply, payload) => {
    req.view = payload.view

    return payload
  })

  app.addHook('onSend', async (req, reply, payload) => {
    if (!req.view) return payload

    if (headerAcceptCheck(req, 'text/html')) {
      // clone original contentType incase it needs to be reverted
      const contentTypeClone = `${reply.header.contentType}`

      try {
        const html = await app.view(req.view, payload)
        reply.header('Content-Type', 'text/html; charset=utf-8')

        return html
      } catch (err) {
        app.log.error(err)
        // revert contentType to the cloned value
        reply.header.contentType = contentTypeClone

        return payload
      }
    }

    return payload
  })
})

function headerAcceptCheck (req, match) {
  return !!req.headers.accept && req.headers.accept.includes(match)
}

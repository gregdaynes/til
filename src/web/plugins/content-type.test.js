const { test } = require('test')

const build = require('@web')
const contentType = require('./content-type')

test('ContentType Response', async (t) => {
  t.plan(3)

  const app = await build()
  t.tearDown(() => app.close())

  app.register(contentType)

  app.get('/test', (req, reply) => {
    reply.send({
      view: 'home.pug',
      message: 'testing',
    })
  })

  app.get('/fail', (req, reply) => {
    reply.send({
      view: 'fail.pug',
      message: 'testing',
    })
  })

  await t.test('handle text/html', async (t) => {
    const results = await app.inject({
      method: 'GET',
      url: '/test',
      headers: {
        accept: 'text/html; charset=utf-8',
      },
    })

    t.strictEqual(results.statusCode, 200)
    t.match(results.headers, {
      'content-type': 'text/html; charset=utf-8',
    })
  })

  await t.test('handle application/json', async (t) => {
    const results = await app.inject({
      method: 'GET',
      url: '/test',
      headers: {
        accept: 'application/json; charset=utf-8',
      },
    })

    t.strictEqual(results.statusCode, 200)
    t.match(results.headers, {
      'content-type': 'application/json; charset=utf-8',
    })
    t.deepEqual(JSON.parse(results.body), {
      view: 'home.pug',
      message: 'testing',
    })
  })

  await t.test('capture error and return payload', async (t) => {
    const results = await app.inject({
      method: 'GET',
      url: '/fail',
      headers: {
        accept: 'text/html; charset=utf-8',
      },
    })

    t.strictEqual(results.statusCode, 200)
    t.match(results.headers, {
      'content-type': 'application/json; charset=utf-8',
    })
    t.deepEqual(JSON.parse(results.body), {
      view: 'fail.pug',
      message: 'testing',
    })
  })

  t.end()
})

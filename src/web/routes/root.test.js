const { test } = require('test')

const build = require('web')

test('route /', async (t) => {
  t.plan(1)

  const app = await build()

  t.tearDown(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: '/',
  })

  await t.test('success response', async (t) => {
    t.strictEqual(response.statusCode, 200)
  })

  t.end()
})

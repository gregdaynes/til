const { test } = require('lib/test')

const build = require('./app')

test('boots the app', async (t) => {
  t.plan(1)

  t.tearDown(() => app.close())
  const app = await build()

  await app.addHook('onReady', async () => {
    t.ok(true)
  })

  await app.ready()

  t.end()
})

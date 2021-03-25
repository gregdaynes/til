const build = require('web/app')
const { test } = require('tap')

test('boots the app', async (t) => {
  t.plan(1)

  const app = await build()
  t.tearDown(() => app.close())

  await app.addHook('onReady', async () => {
    t.ok(true)
  })

  await app.ready()

  t.end()
})

const { test } = require('test')

const database = require('@database')
const faker = require('faker')
const { create, fetch, verifyPassword } = require('@service/account')

test('account', async (t) => {
  t.plan(3)

  await database.migrate.latest()

  t.tearDown(() => database.destroy())

  const uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
  const accountDef = {
    id: uuidRegex,
    email: String,
    password: String,
    username: String,
  }

  const data = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
  }

  await t.test('.create', async (t) => {
    const results = await create(data)

    t.match(results, accountDef, 'returns persisted account')
  })

  await t.test('.fetch', async (t) => {
    const results = await fetch({ username: data.username })

    t.match(results, accountDef, 'returns persisted account')
  })

  await t.test('.verifyPassword', async (t) => {
    const fetchResults = await fetch({ username: data.username })

    await t.test('with correct challenge string', async (t) => {
      const results = await verifyPassword(fetchResults, data.password)

      t.ok(results)
    })

    await t.test('with incorrect challenge string', async (t) => {
      t.rejects(verifyPassword(fetchResults, 'notThePassword'))
    })
  })

  t.end()
})

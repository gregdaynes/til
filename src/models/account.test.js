const Account = require('models/account')
const database = require('lib/database')
const faker = require('faker')
const { test } = require('tap')

const uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/

test('Account', async (t) => {
  t.plan(5)

  await database.migrate.latest()
  t.tearDown(() => database.destroy())

  const email = faker.internet.email()
  const password = faker.internet.password()
  const salt = faker.random.hexaDecimal()
  const username = faker.internet.userName()

  const results = await Account.query().insertGraph({
    email,
    password,
    salt,
    username,
  })

  await t.test('id is a uuid', async (t) => {
    t.match(results.id, uuidRegex)
  })

  await t.test('has email', async (t) => {
    t.deepEqual(results.email, email)
  })

  await t.test('has password', async (t) => {
    t.deepEqual(results.password, password)
  })

  await t.test('has salt', async (t) => {
    t.deepEqual(results.salt, salt)
  })

  await t.test('has username', async (t) => {
    t.match(results.username, username)
  })

  t.end()
})

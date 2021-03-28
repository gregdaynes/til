const { hash, verify } = require('./hash')
const { test } = require('tap')

test('creates hash of a payload', async (t) => {
  t.plan(3)

  const data = 'string to hash'
  const actual = await hash(data)

  t.type(actual, Array, 'returns an array of the hash and salt')
  t.type(actual[0], 'string', 'returns the hash')
  t.type(actual[1], 'string', 'returns the salt')

  t.end()
})

test('creates hash of a payload with custom salt', async (t) => {
  t.plan(4)

  const data = 'string to hash'
  const salt = 'mySecretSalt'
  const actual = await hash(data, salt)

  t.type(actual, Array, 'returns an array of the hash and salt')
  t.type(actual[0], 'string', 'returns the hash')
  t.type(actual[1], 'string', 'returns the salt')
  t.strictEqual(actual[1], salt, 'uses the provided salt')

  t.end()
})

test('verify hash equality', async (t) => {
  t.plan(2)

  const data = 'string to hash'
  const badSalt = 'mySecretSalt'
  const [initialHash, initialSalt] = await hash(data)

  await t.test('verifies the data and salt return the same hash', async (t) => {
    const isValid = await verify(data, initialHash, initialSalt)
    t.ok(isValid)
  })

  await t.test('does not verify the data against a different salt', async (t) => {
    const isNotValid = await verify(data, initialHash, badSalt)
    t.notOk(isNotValid)
  })

  t.end()
})

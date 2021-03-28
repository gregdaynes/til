const Account = require('@model/account')
const { hash, verify } = require('@lib/hash')

module.exports = {
  create,
  fetch,
  verifyPassword,
}

async function create (data) {
  const {
    email,
    password,
    username,
  } = data

  const [hashedPassword, salt] = await hash(password)

  return await Account.query().insertGraph({
    email,
    password: hashedPassword,
    salt,
    username,
  })
}

async function fetch ({ username }) {
  const [account] = await Account.query().where({ username })

  return account
}

async function verifyPassword (account, challenge) {
  const isValid = await verify(challenge, account.password, account.salt)

  if (!isValid) throw new Error('Invalid password')

  return account
}

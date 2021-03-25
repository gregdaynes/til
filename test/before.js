const fs = require('fs')
const path = require('path')

async function before () {
  try {
    // Remove previous test db
    fs.unlinkSync(path.join(__dirname, '..', 'test.sqlite3'))
  } catch (err) {
    if (err.code !== 'ENOENT') throw new Error(err)
  } finally {
    process.exit()
  }
}

before()

#!/bin/env/node

require('./bootstrap.js')
const build = require('../src/web')

const config = {
  logger: true,
}

const { PORT, LISTEN } = process.env

async function start () {
  try {
    const app = await build(config)
    app.listen(PORT, LISTEN)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()

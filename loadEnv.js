const fs = require('fs')
const path = require('path')

module.exports = loadEnv(process.env.NODE_ENV)

function loadEnv (mode) {
  const toKeyValue = (line) => line.trim().split('=')
  const sanitizeKeyValue = ([key, value]) => [key, (value || '').trim()]
  const invalidEnv = ([key, value]) => value !== ''
  const applyEnv = ([key, value]) => { process.env[key] = value }

  [
    '.env',
    '.env.local',
    ...((mode) ? [`.env.${mode}`, `.env.${mode}.local`] : []),
  ]
    .forEach((filename) => {
      const file = path.join(filename)

      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return

      fs.readFileSync(file).toString()
        .split('\n')
        .map(toKeyValue)
        .map(sanitizeKeyValue)
        .filter(invalidEnv)
        .forEach(applyEnv)
    })
}

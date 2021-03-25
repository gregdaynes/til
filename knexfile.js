const { DB_CONNECTION } = process.env

module.exports = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: DB_CONNECTION,
  },
}

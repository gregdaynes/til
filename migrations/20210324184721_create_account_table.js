
exports.up = async function (knex) {
  if (await knex.schema.hasTable('accounts')) return

  return knex.schema.createTable('accounts', (table) => {
    table.string('id').primary()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('salt').notNullable()
    table.string('username').notNullable().unique()
    table.timestamp('created_at').notNullable().defaultTo('now()')
    table.timestamp('updated_at').notNullable().defaultTo('now()')
    table.timestamp('deleted_at')
  })
}

exports.down = function (knex) {

}

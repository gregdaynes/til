const { Model } = require('lib/database')
const { randomUUID } = require('crypto')

class Account extends Model {
  static get tableName () {
    return 'accounts'
  }

  static get idColumn () {
    return 'id'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: [
        'email',
        'password',
        'salt',
        'username',
      ],
      properties: {
        id: {
          type: 'string',
          default: randomUUID(),
        },
        email: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        password: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        salt: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        username: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      },
    }
  }
}

module.exports = Account

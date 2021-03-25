const Knex = require('knex')
const knexfile = require('../../knexfile.js')
const path = require('path')
const { Model } = require('objection')

const knex = Knex(knexfile)
Model.knex(knex)

class BaseModel extends Model {
  static get modelPaths () {
    return [path.join(__dirname, '..', 'models')]
  }
}

module.exports = knex
module.exports.Model = BaseModel

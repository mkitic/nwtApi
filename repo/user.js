const _ = require('lodash')

const error = {}

const { db } = require('../db')

async function getByEmailPassword (email, password) {
  const rawUser = await db.one(`
    SELECT *
    FROM "user"
    WHERE email = $1 and password = $2
  `, [email, password])
  .catch(error.db({
    noData: 'user.not_found',
  }))
  return rawUser
}

module.exports = {
  getByEmailPassword,
}

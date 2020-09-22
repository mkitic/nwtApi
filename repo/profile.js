const { db } = require('../db')

async function getUserByUsernamePassword (username, password) {
  const rawUser = await db().then(con => con.get(`
    SELECT *
    FROM user
    WHERE username = ? and password = ?
  `, [username, password]))
  return rawUser
}

module.exports = {
  getUserByUsernamePassword,
}

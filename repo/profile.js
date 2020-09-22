const { db } = require('../db')
const { mapper, dbMapper } = require('repo/base')

const getMapper = mapper({
  id: 'id',
  email: 'email',
  bio: 'bio',
  profileImg: 'profile_img',
  fullName: 'full_name',
  summary: 'summary',
  username: 'username',
})

async function getUserByUsernamePassword (username, password) {
  const rawUser = await db().then(con => con.get(`
    SELECT *
    FROM user
    WHERE username = ? and password = ?
  `, [username, password]))
  return rawUser
}

async function getProfileById (userId) {
  return db().then(con => con.get(`
    SELECT * FROM user WHERE id = ? 
  `, [userId]))
  .then(getMapper)
}

async function updateProfile (userId, data) {
  return db().then(con => con.run(`
    UPDATE user
      SET bio = :bio, full_name = :fullName, profile_img = :profileImg, summary = :summary
    WHERE id = :userId
  `, dbMapper({ ...data, userId })))
  .then(() => true)
}

module.exports = {
  getUserByUsernamePassword,
  getProfileById,
  updateProfile,
}

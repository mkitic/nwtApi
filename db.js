const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

module.exports = {
  db: async () => {
    const db = await open({
      filename: process.env.DATABASE_URL,
      driver: sqlite3.Database,
    })
    return db
  },
}

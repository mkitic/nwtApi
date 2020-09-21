const joi = require('joi')
const jwt = require('jsonwebtoken')
const router = new (require('koa-router'))()
const { db } = require('db')

const responder = require('middleware/responder')
const auth = require('middleware/auth')
const validate = require('middleware/validate')

router.use(responder)

router.post('/like', auth,
  async function (ctx) {
    const mate = await db().then(con => con.all('SELECT * FROM user '))
    console.log(mate)
    ctx.state.r = mate
  },
)

module.exports = router

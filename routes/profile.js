const router = new (require('koa-router'))()

const jwt = require('jsonwebtoken')
const responder = require('middleware/responder')
const profileRepo = require('repo/profile')
// const validate = require('middleware/validate')

router.use(responder)

router.post('/profile/auth',
  async function (ctx) {
    console.log(ctx.request.body)
    const { username, password } = ctx.request.body
    const user = await profileRepo.getUserByUsernamePassword(username, password)
    if (!user) {
      ctx.state.error = {
        code: 401,
        message: 'Login failed! Bad credentials',
      }
      ctx.state.r = {}
    } else {
      ctx.state.r = { token: jwt.sign({ id: user.id }, process.env.JWT_SECRET) }
    }
  },
)

module.exports = router

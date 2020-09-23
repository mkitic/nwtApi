const router = new (require('koa-router'))()

const jwt = require('jsonwebtoken')
const responder = require('../middleware/responder')
const profileRepo = require('../repo/profile')
const auth = require('../middleware/auth')
const { getLikedPostsForUser } = require('../repo/post')
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

router.get('/profile', auth, async function (ctx) {
  // get profile
  const userId = ctx.state.user.id
  const profile = await profileRepo.getProfileById(userId)
  // get liked posts
  const likedPosts = await getLikedPostsForUser(userId)
  ctx.state.r = {
    ...profile,
    likedPosts,
  }
})

router.put('/profile', auth, async function (ctx) {
  const userId = ctx.state.user.id
  ctx.state.r = await profileRepo.updateProfile(userId, ctx.request.body)
})

router.get('/profile/posts', auth, async function (ctx) {
  const userId = ctx.state.user.id
  // get liked posts
  const likedPosts = await getLikedPostsForUser(userId)
  ctx.state.r = likedPosts
})

module.exports = router

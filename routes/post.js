const router = new (require('koa-router'))()

const responder = require('middleware/responder')
const auth = require('middleware/auth')
const postRepo = require('repo/post')
// const validate = require('middleware/validate')

router.use(responder)

router.post('/like', auth,
  async function (ctx) {
    console.log('PASTED', ctx.request.body)
    await postRepo.like(ctx.request.body, ctx.state.user.id)
    ctx.state.r = await postRepo.getLikedPostsForUser(ctx.state.user.id)
  },
)

module.exports = router

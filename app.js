const app = new (require('koa'))()
const mount = require('koa-mount')

app.silent = process.env.LOG < 3
app.use(require('koa-etag')())
app.use(require('koa-helmet')())
app.use(require('kcors')())
app.use(require('koa-bodyparser')())

// app.use(mount('/', require('routes/profile').routes()))
app.use(mount('/', require('routes/test').routes()))

app.use(async (ctx, next) => {
  ctx.throw(404)
  await next()
})

module.exports = app

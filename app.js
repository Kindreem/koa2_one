const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// mongoose
const mongoose = require('mongoose')
const dbs = require('./dbs/config') // 引用配置文件

// 跨域
const cors = require('koa2-cors')
app.use(cors(
  {
    origin:"http://localhost:8089", // 允许来自指定域名请求
    maxAge: 5, // 本次预检请求的有效期，单位为秒。
    methods:['GET','POST'],  // 所允许的HTTP请求方法
    alloweHeaders:['Conten-Type'], // 服务器支持的所有头信息字段
    credentials: true // 是否允许发送Cookie
  }
))

const index = require('./routes/index')
const users = require('./routes/datas')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// mongoose
mongoose.connect(dbs.dbs,{ useNewUrlParser: true,useUnifiedTopology: true },function(){
  console.log('connection is success')
})

module.exports = app

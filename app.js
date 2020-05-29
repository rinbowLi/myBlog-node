const express = require("express")
const db = require("./connect")
const path = require("path")
const userRouter = require("./router/userRouter")
const articleRouter = require("./router/articleRouter")
const fileRouter = require("./router/fileRouter")
const commentRouter = require("./router/commentsRouter")
const timelineRouter = require("./router/timelineRouter")
const messageRouter = require("./router/messageRouter")

const app = express()
const bodyParser = require("body-parser")

const session = require("express-session")

app.use(session({
  secret: "chenxin", //为了安全性考虑设置secret属性
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }, //设置过期时间
  resave: true, //即使session没有被修改，也保存session值，默认为true
  saveUninitialized: false //无论有没有session cookie，每次请求都设置session cookie，默认给个标示为connect.sid
}))


//图片验证码插件
var svgCaptcha = require('svg-captcha');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())
app.use("/public", express.static(path.join(__dirname, "./uploads")))

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Credentials",true)
  // 第二个参数表示允许跨域的域名，* 代表所有域名  
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
  // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  if (req.method == 'OPTIONS') {
      res.sendStatus(200)
  } else {
      next()
  }
});

app.use("/user", userRouter)
app.use("/article", articleRouter)
app.use("/file", fileRouter)
app.use("/comment", commentRouter)
app.use("/timeline", timelineRouter)
app.use("/message", messageRouter)

app.get('/captcha', function (req, res) {
  var codeConfig = {
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    height: 44
  }

  var captcha = svgCaptcha.create(codeConfig);
  req.session.captcha = captcha.text;
  console.log(req.session)

  res.type('svg');
  res.status(200).send({
    code: 0,
    msg: "获取图片验证码成功",
    data: captcha
  });
});

app.listen("3000", (req, res) => {
  console.log("服务开启了")
})
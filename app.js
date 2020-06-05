const express = require("express")
const db = require("./connect")
const path = require("path")
const userRouter = require("./router/userRouter")
const articleRouter = require("./router/articleRouter")
const fileRouter = require("./router/fileRouter")
const commentRouter = require("./router/commentsRouter")
const timelineRouter = require("./router/timelineRouter")
const messageRouter = require("./router/messageRouter")
const linkRouter = require("./router/linkRouter")

const app = express()
const bodyParser = require("body-parser")

const session = require("express-session")

const expressJwt = require('express-jwt');
const _token = require('./utils/token');
// 解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  console.log(token)
  if (token == undefined) {
    return next();
  } else {
    _token.verToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      console.log(error);
      return next();
    })
  }
});

app.use(function (err, req, res, next) {
  console.log(err);
  if (err.name === 'UnauthorizedError') {
    console.error(req.path + ',无效token');
    res.send({
      message: 'token过期，请重新登录',
      code: 401
    })
    return
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//不需要token验证的接口数组
const DonotNeedTokenArr = ['/', '/captcha', '/user/login', '/article/selectArticleById', '/article/selectArticleBykeyword', '/article/selectArticleByPage', '/article/getArticleCount', '/article/selectArticleByCatalog', '/article/selectNextAndPrevArticle', '/comment/selectCommentsById', '/link/selectLink','/message/addmessage', '/message/selectMessageByPage', '/message/getMessageCount', '/timeline/selectTimeline']

//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
  secret: 'myblog_rinbowli'
}).unless({
  path: DonotNeedTokenArr //除了这些地址，其他的URL都需要验证
}));

app.use(session({
  secret: "rinbowli", //为了安全性考虑设置secret属性
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
  res.header("Access-Control-Allow-Credentials", true)
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
app.use("/link", linkRouter)

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
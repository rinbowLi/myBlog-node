const express = require("express")
const db = require("./connect")
const path = require("path")
const userRouter = require("./router/userRouter")
const articleRouter = require("./router/articleRouter")
const fileRouter = require("./router/fileRouter")

const app = express()
const bodyParser = require("body-parser")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())
app.use("/public", express.static(path.join(__dirname, "./uploads")))

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use("/user", userRouter)
app.use("/article", articleRouter)
app.use("/file", fileRouter)

app.listen("3000", (req, res) => {
  console.log("服务开启了")
})
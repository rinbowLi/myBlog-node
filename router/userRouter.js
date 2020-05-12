const express = require("express")

const router = express.Router()
const user = require("../model/userModel")
const email = require("../utils/mail")

let codes = {} //声明全局变量保存验证码到内存中

/**
 * @api {post} /user/register 用户注册接口
 * @apiName register
 * @apiGroup user
 *
 * @apiParam {String} username 唯一的用户名.
 * @apiParam {String} password 密码.
 * @apiParam {String} mail 关联邮箱.
 * @apiParam {String} code 邮箱验证码.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/register", (req, res) => {
  //数据获取
  let {
    username,
    password,
    mail,
    code
  } = req.body;
  console.log(username, password, code)
  if (!username || !password || !code) {
    return res.send({
      code: -1,
      msg: "请输入用户名、密码和验证码"
    })
  } else {
    if (codes[mail].randomCode!= code) {
      return res.send({
        code: -1,
        msg: "验证码错误"
      })
    }
    user.find({
        username
      })
      .then(data => {
        if (!data.length) {
          return user.insertMany({
            username,
            password
          })
        } else {
          res.send({
            code: -1,
            msg: "用户名已存在"
          })
          return;
        }
      })
      .then(result => {
        console.log("数据插入成功")
        console.log(result)
        res.send({
          code: 0,
          msg: "注册成功"
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  //数据处理
  //返回数据
})

/**
 * @api {post} /user/login 用户登录接口
 * @apiName login
 * @apiGroup user
 *
 * @apiParam {String} username 唯一的用户名.
 * @apiParam {String} password 密码.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/login", (req, res) => {
  let {
    username,
    password
  } = req.body;
  if (!username || !password) {
    res.send({
      code: -1,
      msg: "请输入用户名或密码"
    })
  } else {
    user.find({
        username,
        password
      })
      .then(result => {
        console.log(result);
        if (result.length > 0) {
          //登陆成功后将用户信息保存到session中
          req.session.login=true;
          req.session.username = username
          console.log(req.session)
          res.send({
            code: 0,
            msg: "登录成功"
          })
        } else {
          res.send({
            code: -1,
            msg: "用户名或密码不正确"
          })
        }
      })
      .catch(err => {
        console.log(err)
        res.send({
          code: -1,
          msg: "未知错误"
        })
      })
  }
})

/**
 * @api {post} /user/getMailCode 用户获取邮箱验证码接口
 * @apiName getMailCode
 * @apiGroup user
 *
 * @apiParam {String} mail 用户邮箱.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/getMailCode", (req, res) => {
  let {
    mail
  } = req.body;
  let mailRegx = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (!mail || !mailRegx.test(mail)) {
    return res.send({
      code: -1,
      msg: "邮箱不合法"
    })
  }
  //如果内存中存在该邮箱的验证码，而且过期时间在五分钟之内
  if (codes[mail] && (new Date().getTime() - codes[mail].createTime) < 1000 * 60 * 5) {
    return res.send({
      code: -1,
      msg: "五分钟之内不能再次获取验证码"
    })
  }
  let randomCode = parseInt(Math.random() * 100000);
    //不足6位数时用0补齐
  randomCode = randomCode.toString().padStart(6, "0")

  email.sendMail(mail, "邮箱注册邮件", randomCode)
    .then(() => {
      //保存验证码到内存中
      codes[mail] = {
        createTime: new Date().getTime(),
        randomCode
      };
      console.log(codes)
      res.send({
        code: 0,
        msg: "邮箱验证码发送成功"
      })
    })
    .catch((err) => {
      console.log(err)
      res.send({
        code: 0,
        msg: "未知错误"
      })
    })

})

module.exports = router;
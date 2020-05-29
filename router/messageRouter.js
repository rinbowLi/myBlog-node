const express = require("express")

const router = express.Router()
const message = require("../model/messageModel")


/**
 * @api {post} /message/addmessage 添加留言接口
 * @apiName addmessage
 * @apiGroup comments
 *
 * @apiParam {String} content 留言内容.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/addmessage", (req, res) => {
  //数据获取
  let {
    content,
    name,
    email
  } = req.body;
  if (!content) {
    return res.send({
      code: -1,
      msg: "请填写留言内容"
    });
  }
  if (!name) {
    return res.send({
      code: -1,
      msg: "请填写昵称"
    });
  }
  message.insertMany({
      content,
      email,
      name,
      createTime: new Date().getTime()
    })
    .then(result => {
      return res.send({
        code: 0,
        msg: "提交留言内容成功"
      });
    })
    .catch(err => {
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})

/**
 * @api {post} /message/selectmessage 分页查询留言接口
 * @apiName selectmessage
 * @apiGroup message
 *
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectMessageByPage", (req, res) => {
  //数据获取
  let pageSize = req.body.pageSize || 10;
  let page = req.body.page || 1;
  message.find().limit(Number(pageSize)).skip(Number(pageSize * (page - 1))).sort({
      time: -1
    }) //留言标题和内容模糊查询
    .then(result => {
      return res.send({
        code: 0,
        msg: "留言查询成功",
        data: result
      });
    })
    .catch(err => {
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})

/**
 * @api {post} /Message/getMessageCount 分页查询留言接口
 * @apiName getMessageCount
 * @apiGroup Message
 *
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/getMessageCount", (req, res) => {
  message.countDocuments()
    .then(result => {
      return res.send({
        code: 0,
        msg: "留言数量查询成功",
        data: result
      });
    })
    .catch(err => {
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})

module.exports = router;
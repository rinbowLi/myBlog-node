const express = require("express")

const router = express.Router()
const timeline = require("../model/timelineModel")


/**
 * @api {post} /timeline/addtimeline 添加文章接口
 * @apiName addtimeline
 * @apiGroup comments
 *
 * @apiParam {String} content 时光轴内容.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/addtimeline", (req, res) => {
  //数据获取
  let {
    content,
  } = req.body;
  if (!content) {
    return res.send({
      code: -1,
      msg: "请填写时光轴内容"
    });
  }
  timeline.insertMany({
      content,
      time: new Date().getTime()
    })
    .then(result => {
      return res.send({
        code: 0,
        msg: "提交时光轴内容成功"
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
 * @api {post} /timeline/selectTimeline 精准查询文章接口
 * @apiName selectTimeline
 * @apiGroup timeline
 *
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectTimeline", (req, res) => {

  timeline.find().sort({
      id: -1
    })
    .then(result => {
      return res.send({
        code: 0,
        msg: "时光轴查询成功",
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
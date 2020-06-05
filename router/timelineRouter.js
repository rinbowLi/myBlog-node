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

/**
 * @api {post} /timeline/selecttimeline 分页查询时光轴接口
 * @apiName selecttimeline
 * @apiGroup timeline
 *
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectTimelineByPage", (req, res) => {
  //数据获取
  let pageSize = req.body.pageSize || 10;
  let page = req.body.page || 1;
  timeline.find().limit(Number(pageSize)).skip(Number(pageSize * (page - 1))).sort({
      time: -1
    }) //时光轴标题和内容模糊查询
    .then(result => {
      timeline.countDocuments().then(
        res1 => {
          return res.send({
            code: 0,
            msg: "时光轴查询成功",
            data: result,
            total: res1
          });
        })
    })
    .catch(err => {
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})

/**
 * @api {post} /timeline/delTimeline 删除时光轴接口
 * @apiName delTimeline
 * @apiGroup timeline
 *
 * @apiParam {String} id 时光轴唯一id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/delTimeline", (req, res) => {
  //数据获取
  let {
    id
  } = req.body;
  if (!id) {
    return res.send({
      code: -1,
      msg: "请填写时光轴id"
    });
  }
  timeline.deleteOne({
      _id: id
    })
    .then(result => {
      return res.send({
        code: 0,
        msg: "时光轴删除成功"
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
const express = require("express")

const router = express.Router()
const comments = require("../model/commentsModel")


/**
 * @api {post} /comments/addcomments 添加文章接口
 * @apiName addcomments
 * @apiGroup comments
 *
 * @apiParam {String} name 评论人.
 * @apiParam {String} content 评论内容.
 * @apiParam {String} relatedArticleId 关联文章id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/addComments", (req, res) => {
  //数据获取
  let {
    name,
    content,
    relatedArticleId
  } = req.body;
  if (!title || !content) {
    return res.send({
      code: -1,
      msg: "请填写评论人和评论内容"
    });
  }
  comments.insertMany({
    name,
      content,
      relatedArticleId,
      createTime: new Date().getTime()
    })
    .then(result => {
      console.log(result)
      return res.send({
        code: 0,
        msg: "评论提交成功"
      });
    })
    .catch(err => {
      console.log(err);
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})

/**
 * @api {post} /comments/delComments 删除评论接口
 * @apiName delComments
 * @apiGroup comments
 *
 * @apiParam {String} id 评论唯一id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/delComments", (req, res) => {
  //数据获取
  let {
    id
  } = req.body;
  if (!id) {
    return res.send({
      code: -1,
      msg: "请填写评论id"
    });
  }
  comments.deleteOne({
      _id: id
    })
    .then(result => {
      console.log(result)
      return res.send({
        code: 0,
        msg: "评论删除成功"
      });
    })
    .catch(err => {
      console.log(err);
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})

/**
 * @api {post} /comments/selectCommentsById 精准查询文章接口
 * @apiName selectCommentsById
 * @apiGroup comments
 *
 * @apiParam {String} id 文章唯一id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectCommentsById", (req, res) => {
  //数据获取
  let {
    id
  } = req.body;
  if (!id) {
    return res.send({
      code: -1,
      msg: "请填写文章id"
    });
  }
  comments.findById({
      _id: id
    })
    .then(result => {
      console.log(result)
      return res.send({
        code: 0,
        msg: "文章查询成功",
        data: result
      });
    })
    .catch(err => {
      console.log(err);
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})


module.exports = router;
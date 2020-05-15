const express = require("express")

const router = express.Router()
const comments = require("../model/commentsModel")
const article = require("../model/articleModel")


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
    relatedArticleId,
    parent,
    reply
  } = req.body;
  if (!name || !content) {
    return res.send({
      code: -1,
      msg: "请填写评论人和评论内容"
    });
  }
  comments.insertMany({
      name,
      content,
      relatedArticleId,
      parent: parent || 0,
      reply: reply || "",
      createTime: new Date().getTime()
    })
    .then(result => {
      //评论成功后，该文章的commentCount自增1
      article.findOneAndUpdate({
        _id: relatedArticleId
      }, {
        $inc: {
          commentCount: 1
        }
      }, (err) => {
        if (!err) {
          return res.send({
            code: 0,
            msg: "评论提交成功"
          });
        } else {
          return res.send({
            code: -1,
            msg: "系统错误"
          });
        }
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
      return res.send({
        code: 0,
        msg: "评论删除成功"
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
  //lean 方法返回的数据才可以修改，否则修改不生效
  // sort {xxx:-1}  以xxx为倒序排列
  comments.find({
      relatedArticleId: id,
      parent: 0
    }).lean().sort({
      createTime: -1
    })
    .then(result => {
      if (result.length > 0) {
        result.map((v, i) => {
          v.children = []
          comments.find({
            parent: v.id
          }).lean().then(ret => {
            ret.map(item => {
              if (v.id === item.parent) {
                v.children.push(item)
              }
            })
            if (i === result.length - 1) {
              console.log(result)
              return res.send({
                code: 0,
                msg: "评论查询成功",
                data: result
              });
            }
          })
        })
      } else {
        return res.send({
          code: 0,
          msg: "评论查询成功",
          data: result
        });
      }
    })
    .catch(err => {
      console.log(err)
      return res.send({
        code: -1,
        msg: "系统错误"
      });
    })
})

module.exports = router;
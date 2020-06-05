const express = require("express")

const router = express.Router()
const comments = require("../model/commentsModel")
const article = require("../model/articleModel")


/**
 * @api {post} /comments/addcomments 添加评论接口
 * @apiName addcomments
 * @apiGroup comments
 *
 * @apiParam {String} name 评论人.
 * @apiParam {String} content 评论内容.
 * @apiParam {String} relatedArticleId 关联评论id.
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
      //评论成功后，该评论的commentCount自增1
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
 * @api {post} /comments/selectCommentsById 精准查询评论接口
 * @apiName selectCommentsById
 * @apiGroup comments
 *
 * @apiParam {String} id 评论唯一id.
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
      msg: "请填写评论id"
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

/**
 * @api {post} /comment/selectCommentsByPage 分页查询评论接口
 * @apiName selectCommentsByPage
 * @apiGroup comment
 *
 * @apiParam {Number} pageSize 每一页的数量
 * @apiParam {Number} page 当前第几页
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectCommentsByPage", (req, res) => {
  //数据获取
  let pageSize = req.body.pageSize || 10;
  let page = req.body.page || 1;
  comments.find().limit(Number(pageSize)).skip(Number(pageSize * (page - 1))).sort({
      time: -1
    }) //评论标题和内容模糊查询
    .then(result => {
      comments.countDocuments().then(
        res1 => {
          return res.send({
            code: 0,
            msg: "评论查询成功",
            data: result,
            total:res1   
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

module.exports = router;
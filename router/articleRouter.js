const express = require("express")

const router = express.Router()
const article = require("../model/articleModel")


/**
 * @api {post} /article/addArticle 添加文章接口
 * @apiName addArticle
 * @apiGroup article
 *
 * @apiParam {String} title 文章标题.
 * @apiParam {String} content 文章内容.
 * @apiParam {String} catalog 文章分类.
 * @apiParam {String} tags 文章标签.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/addArticle", (req, res) => {
  //数据获取
  let {
    title,
    content,
    catalog,
    tags
  } = req.body;
  if (!title || !content) {
    return res.send({
      code: -1,
      msg: "请填写文章标题和文章内容"
    });
  }
  article.insertMany({
      title,
      content,
      catalog,
      time: new Date().getTime(),
      tags
    })
    .then(result => {
      console.log(result)
      return res.send({
        code: 0,
        msg: "文章提交成功"
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
 * @api {post} /article/delArticle 删除文章接口
 * @apiName delArticle
 * @apiGroup article
 *
 * @apiParam {String} id 文章唯一id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/delArticle", (req, res) => {
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
  article.deleteOne({
      _id: id
    })
    .then(result => {
      console.log(result)
      return res.send({
        code: 0,
        msg: "文章删除成功"
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
 * @api {post} /article/updateArticle 修改文章接口
 * @apiName updateArticle
 * @apiGroup article
 *
 * @apiParam {String} id 文章唯一id.
 * @apiParam {String} title 文章标题.
 * @apiParam {String} content 文章内容.
 * @apiParam {String} catalog 文章分类.
 * @apiParam {String} tags 文章标签.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/updateArticle", (req, res) => {
  //数据获取
  let {
    id,
    title,
    content,
    catalog,
    tags
  } = req.body;
  if (!id) {
    return res.send({
      code: -1,
      msg: "请填写文章id"
    });
  }
  if (!title || !content) {
    return res.send({
      code: -1,
      msg: "请填写文章标题和文章内容"
    });
  }
  article.updateOne({
      _id: id,
      title,
      content,
      catalog,
      tags,
      time: new Date().getTime(),
    })
    .then(result => {
      console.log(result)
      return res.send({
        code: 0,
        msg: "文章修改成功"
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
 * @api {post} /article/selectArticleById 精准查询文章接口
 * @apiName selectArticleById
 * @apiGroup article
 *
 * @apiParam {String} id 文章唯一id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectArticleById", (req, res) => {
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
  article.findById({
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

/**
 * @api {post} /article/selectArticleBykeyword 模糊查询文章接口
 * @apiName selectArticleBykeyword
 * @apiGroup article
 *
 * @apiParam {String} keyword 查询关键字.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectArticleBykeyword", (req, res) => {
  //数据获取
  let {
    keyword
  } = req.body;
  if (!keyword) {
    return res.send({
      code: -1,
      msg: "请填写关键字"
    });
  }
  let reg = new RegExp(keyword);
  //article.find({title:{$regex:reg}})   //文章标题模糊查询
  article.find({
      $or: [{
        title: {
          $regex: reg
        }
      }, {
        content: {
          $regex: reg
        }
      }]
    }) //文章标题和内容模糊查询
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


/**
 * @api {post} /article/selectArticleByPage 分页查询文章接口
 * @apiName selectArticleByPage
 * @apiGroup article
 *
 * @apiParam {Number} pageSize 每一页的数量
 * @apiParam {Number} page 当前第几页
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectArticleByPage", (req, res) => {
  //数据获取
  let pageSize =req.body.pageSize || 10;
  let page =req.body.page || 1;
  article.find().limit(Number(pageSize)).skip(Number(pageSize*(page-1))) //文章标题和内容模糊查询
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
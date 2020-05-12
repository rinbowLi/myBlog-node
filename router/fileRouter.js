const express = require("express")

const router = express.Router()
const multer = require("multer")

let storage = multer.diskStorage({
  //设置上传文件路径，uploads文件夹会自动创建。
  destination: function (req, file, cb) {
    cb(null, './uploads/img')
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split(".");
    //给图片加上时间戳防止重名
    //数组最后一项为后缀名
    cb(null, file.originalname.split(".")[0] + "-" + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});

let upload = multer({
  storage
})

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

router.post('/upload', upload.single("file"), (req, res) => {
  //'file'指的是file对象的key值
  let {
    size,
    mimetype,
    path
  } = req.file;

  //定义允许上传的类型
  let types = ["jpg", "png", "gif", "jpeg"];
  let tmpType = mimetype.split("/")[1];
  //限制大小500k
  if (size > 500 * 1024) {
    return res.send({
      code: -1,
      msg: "图片文件太大"
    })
  } else if (!types.includes(tmpType)) {
    return res.send({
      code: -2,
      msg: "图片后缀名不支持"
    })
  } else {
    let url = `/public/img/${req.file.filename}`
    res.send({
      code: 0,
      msg: "文件上传成功",
      url
    })
  }

  console.log(req.file)
})


module.exports = router;
const express = require("express")
const fs = require("fs")

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
 * @api {post} /image/uploadImage 添加文章接口
 * @apiName uploadImage
 * @apiGroup image
 *
 * @apiParam {String} name 友链名称.
 * @apiParam {String} link 友链网址.
 * @apiParam {String} imgUrl 友链图片链接.
 * @apiParam {String} desc 友链描述.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/uploadImage", upload.single("file"), (req, res) => {
    //'file'指的是file对象的key值
    let {
        size,
        mimetype,
        path
    } = req.file;
    //定义允许上传的类型
    let types = ["jpg", "png", "gif", "jpeg"];
    let tmpType = mimetype.split("/")[1];
    //限制大小800k
    if (size > 800 * 1024) {
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
            msg: "文件上传并保存成功",
            url
        })

    }

})


/**
 * @api {post} /link/delLink 删除时光轴接口
 * @apiName delLink
 * @apiGroup link
 *
 * @apiParam {String} id 时光轴唯一id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/delImgByUrl", (req, res) => {
    //数据获取
    let {
        url
    } = req.body;
    if (!url) {
        return res.send({
            code: -1,
            msg: "请填写图片id和url"
        });
    }
    //删除图片文件
    let index = url.lastIndexOf("/");
    let imgName = url.substr(index + 1);
    fs.readdirSync('uploads').map((file) => {
        console.log(file)
        fs.unlink(`uploads/${file}/${imgName}`, (err) => {
            if (err) {
                console.log(err);
                return res.send({
                    code: -1,
                    msg: err
                });
            } else {
                return res.send({
                    code: 0,
                    msg: "图片删除成功"
                });
            }
        });
    });

})


module.exports = router;
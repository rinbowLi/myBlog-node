const express = require("express")

const router = express.Router()
const linkModel = require("../model/linkModel")


/**
 * @api {post} /link/addlink 添加文章接口
 * @apiName addlink
 * @apiGroup comments
 *
 * @apiParam {String} name 友链名称.
 * @apiParam {String} link 友链网址.
 * @apiParam {String} imgUrl 友链图片链接.
 * @apiParam {String} desc 友链描述.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/addLink", (req, res) => {
    //数据获取
    let {
        link,
        name,
        imgUrl,
        desc
    } = req.body;
    if (!name || !name || !desc) {
        return res.send({
            code: -1,
            msg: "请完整填写友链信息"
        });
    }
    linkModel.insertMany({
            link,
            name,
            imgUrl,
            desc,
            time: new Date().getTime()
        })
        .then(result => {
            return res.send({
                code: 0,
                msg: "提交友链成功"
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
 * @api {post} /link/selectlink 精准查询文章接口
 * @apiName selectlink
 * @apiGroup link
 *
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectLink", (req, res) => {

    linkModel.find().sort({
            id: -1
        })
        .then(result => {
            return res.send({
                code: 0,
                msg: "友链查询成功",
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
 * @api {post} /link/selectlink 分页查询时光轴接口
 * @apiName selectlink
 * @apiGroup link
 *
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 * @apiSuccess {Array} data  返回数据.
 */
router.post("/selectLinkByPage", (req, res) => {
    //数据获取
    let pageSize = req.body.pageSize || 10;
    let page = req.body.page || 1;
    linkModel.find().limit(Number(pageSize)).skip(Number(pageSize * (page - 1))).sort({
            time: -1
        }) //时光轴标题和内容模糊查询
        .then(result => {
            linkModel.countDocuments().then(
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
 * @api {post} /link/delLink 删除时光轴接口
 * @apiName delLink
 * @apiGroup link
 *
 * @apiParam {String} id 时光轴唯一id.
 *
 * @apiSuccess {Number} code 返回状态码.
 * @apiSuccess {String} msg  返回消息.
 */
router.post("/delLink", (req, res) => {
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
    linkModel.deleteOne({
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
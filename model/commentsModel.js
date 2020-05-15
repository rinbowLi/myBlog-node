const mongoose = require("mongoose")

let counter = 1;
let CountedId = {type: Number, default: () => counter++};

//3.创建Schema对象
let commentsSchema = mongoose.Schema({
  id: CountedId,
  name: {   //评论人
    type: String,
    required: true
  },
  content: {  //文章内容
    type: String,
    required: true
  },
  createTime: Date,
  relatedArticleId:String,  //关联文章id
  parent:Number,    //关联顶层评论id   0--不关联评论 其他为关联评论的id
  reply:String     //回复对象 为空则为文章顶层评论
})


//4.将Schema对象转换成数据模型
let commentsModel = mongoose.model("comments", commentsSchema);

module.exports = commentsModel

commentsModel.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1;
    });
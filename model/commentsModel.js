const mongoose = require("mongoose")

//3.创建Schema对象
let commentsSchema = mongoose.Schema({
  name: {   //评论人
    type: String,
    required: true
  },
  content: {  //文章内容
    type: String,
    required: true
  },
  createTime: Date,
  relatedArticleId:String  //关联文章id
})


//4.将Schema对象转换成数据模型
let commentsModel = mongoose.model("comments", commentsSchema);

module.exports = commentsModel
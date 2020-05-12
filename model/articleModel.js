const mongoose = require("mongoose")

//3.创建Schema对象
let articleSchema = mongoose.Schema({
  title: {   //文章标题
    type: String,
    required: true
  },
  content: {  //文章内容
    type: String,
    required: true
  },
  time: Date,
  catalog: String,  //文章分类
  tags:String       //文章标签
})


//4.将Schema对象转换成数据模型
let articleModel = mongoose.model("article", articleSchema);

module.exports = articleModel
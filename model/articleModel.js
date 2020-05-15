const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false)

let counter = 1;
let CountedId = {type: Number, default: () => counter++};

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
  tags:String,       //文章标签
  isTop:Number,  //1-置顶 0-普通
  commentCount:Number,  //评论数
  viewsCount:Number,      //阅读次数
  allowComment:Number, //1-允许 0-不允许
  updateTime: Date,
  id:CountedId

})


//4.将Schema对象转换成数据模型
let articleModel = mongoose.model("article", articleSchema);

module.exports = articleModel

articleModel.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1;
    });
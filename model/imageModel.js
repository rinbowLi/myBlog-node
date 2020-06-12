const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false)


//3.创建Schema对象
let imageSchema = mongoose.Schema({
  parentId: {  //关联文章id
    type: String,
    required: true
  },
  imageUrl:{
    type:String,
    required: true
  },
  createTime: Date, //时间
})


//4.将Schema对象转换成数据模型
let imageModel= mongoose.model("image", imageSchema);

module.exports = imageModel
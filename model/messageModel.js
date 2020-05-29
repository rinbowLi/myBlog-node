const mongoose = require("mongoose")

let counter = 1;
let CountedId = {type: Number, default: () => counter++};

//3.创建Schema对象
let messageSchema = mongoose.Schema({
  id: CountedId,
  name: {   //评论人
    type: String,
    required: true
  },
  content: {  //文章内容
    type: String,
    required: true
  },
  email:String,
  createTime: Date,
})


//4.将Schema对象转换成数据模型
let messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel

messageModel.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1;
    });
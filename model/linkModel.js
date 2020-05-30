const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false)

let counter = 1;
let CountedId = {type: Number, default: () => counter++};

//3.创建Schema对象
let linkSchema = mongoose.Schema({
  name: {  //友链名称
    type: String,
    required: true
  },
  link:String,
  desc:String,
  imgUrl:String,
  time: Date, //时间
  id:CountedId

})


//4.将Schema对象转换成数据模型
let linkModel= mongoose.model("link", linkSchema);

module.exports = linkModel

linkModel.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1;
    });
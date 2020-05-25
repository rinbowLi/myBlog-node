const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false)

let counter = 1;
let CountedId = {type: Number, default: () => counter++};

//3.创建Schema对象
let timelineSchema = mongoose.Schema({
  content: {  //时光轴内容
    type: String,
    required: true
  },
  time: Date, //时间
  id:CountedId

})


//4.将Schema对象转换成数据模型
let timelineModel = mongoose.model("timeline", timelineSchema);

module.exports = timelineModel

timelineModel.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1;
    });
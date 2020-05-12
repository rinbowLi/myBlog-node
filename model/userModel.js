const mongoose = require("mongoose")

//3.创建Schema对象
let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  age: Number,
  sex: {
    type: Number,
    default: 0
  },
})


//4.将Schema对象转换成数据模型
let userModel = mongoose.model("user", userSchema);

module.exports = userModel
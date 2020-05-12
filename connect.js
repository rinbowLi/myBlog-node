const mongoose =require("mongoose")
//1、首先连接数据库
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true },(err)=>{

})

//2.创建数据库连接对象
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("连接成功")
});
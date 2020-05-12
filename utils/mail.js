"use strict";
const nodemailer = require("nodemailer");


//创建发送邮件的对象
let transporter = nodemailer.createTransport({
  host: "smtp.qq.com", //发送方域名 在nodemailer模块中的nodemailer/lib/well-known/services.json中查找
  port: 465, //端口
  secure: true, // true for 465, false for other ports
  auth: {
    user: "1165973875@qq.com", // 发送方的邮箱地址
    pass: "rtiivyfkdlyqjagf" // 发送方的mtp验证码
  }
});

function sendMail(mail, subject, code) {
  // 发送的对象(邮箱信息)
  let mailObj = {
    from: '<1165973875@qq.com>', // sender address
    to: mail, // list of receivers
    subject: subject, // 邮件标题
    //text和html只能存在一个，不然会冲突，要么纯文本，要么html
    text: `您的验证码是${code}，有效期为5分钟。`, // plain text body
    //html: "<b>Hello world?</b>" // html body
  };

  //发送邮件
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailObj, (err, info) => {
      if (!err) {
        resolve(info)
      } else {
        reject(err)
      }
    });
  })

}

module.exports = {
  sendMail
}
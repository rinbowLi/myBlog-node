const jwt = require('jsonwebtoken');

//秘钥
var signkey = 'myblog_rinbowli';
//生成token
function setToken(username) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({
      username: username
    }, signkey, {
      expiresIn: 60 * 60 * 24 * 3
    });
    let info = jwt.verify(token.split(' ')[1], signkey)
    console.log(info);
    console.log('token', token);
    resolve(token);
  })
}
//验证token
function verToken(token) {
  return new Promise((resolve, reject) => {
    var info = jwt.verify(token, signkey, (error, decoded) => {
      if (error) {
        console.log(error.message)
        return
      }
      console.log(decoded)
    });
    resolve(info);
  })
}

module.exports = {
  setToken,
  verToken
}
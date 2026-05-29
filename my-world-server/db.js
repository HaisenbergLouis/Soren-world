const mysql = require('mysql2')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'video_db', // 自己先创建这个数据库
  charset: 'utf8mb4'
})

module.exports = db.promise()
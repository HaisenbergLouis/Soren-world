const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const multer = require('multer')
const nodemailer = require('nodemailer')
require('dotenv').config({ path: __dirname + '/.env' })
const db = require('./db')

const app = express()
const port = 3001

// ─── 管理后台密码 ──────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'haix2005'
// 存储有效的管理 token（简单内存方案，重启后失效）
const adminTokens = new Set()

// 生成登录 token
function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

// ─── 邮件通知配置 ─────────────────────────────────────
const MAIL_CONFIG = {
  // 接收通知的邮箱（即你的 QQ 邮箱）
  to: process.env.MAIL_TO || '3542957547@qq.com',
  // QQ 邮箱 SMTP 配置
  smtp: {
    host: process.env.MAIL_HOST || 'smtp.qq.com',
    port: Number(process.env.MAIL_PORT) || 465,
    secure: true, // 465 端口用 SSL
    auth: {
      user: process.env.MAIL_USER || '3542957547@qq.com',
      // ❗ 这不是 QQ 密码，是 SMTP 授权码，需在 QQ 邮箱设置中生成
      pass: process.env.MAIL_PASS || '',
    },
  },
}

// 创建邮件 transporter（如果配置了密码才启用）
let mailTransporter = null
if (MAIL_CONFIG.smtp.auth.pass && MAIL_CONFIG.smtp.auth.pass !== '你的授权码') {
  mailTransporter = nodemailer.createTransport(MAIL_CONFIG.smtp)
  console.log('📧 邮件通知已启用')
} else {
  console.log('📧 邮件通知未配置（设置 MAIL_PASS 后启用）')
}

/** 发送邮件通知 */
async function sendContactNotification({ name, email, message }) {
  if (!mailTransporter) return
  try {
    await mailTransporter.sendMail({
      from: `"MyWorld 留言" <${MAIL_CONFIG.smtp.auth.user}>`,
      to: MAIL_CONFIG.to,
      subject: `💬 新留言来自 ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">📩 新的联系表单留言</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; width: 80px;">姓名</td>
              <td style="padding: 8px 12px; border: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">邮箱</td>
              <td style="padding: 8px 12px; border: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; vertical-align: top;">留言</td>
              <td style="padding: 8px 12px; border: 1px solid #eee; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="color: #999; font-size: 12px; text-align: center;">
            你可以直接回复此邮件与访客沟通
          </p>
        </div>
      `,
    })
    console.log(`📧 已发送邮件通知给 ${MAIL_CONFIG.to}`)
  } catch (err) {
    console.log('📧 发送邮件失败（不影响留言保存）:', err.message)
  }
}

// 验证 token 的中间件（给管理接口用）
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token']
  if (!token || !adminTokens.has(token)) {
    return res.json({ code: 401, msg: '未授权，请重新登录' })
  }
  next()
}

// 中间件
app.use(cors())
app.use(express.json())

// ─── 视频上传配置（multer）────────────────────────────
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, './uploads/videos')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // 保留原始扩展名，加时间戳防止重名
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 最大 500MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.webm', '.mov', '.avi', '.mkv']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) return cb(null, true)
    cb(new Error('不支持的文件格式，请上传 mp4/webm/mov/avi/mkv'))
  },
})

// ─── 静态资源 ────────────────────────────────────────
app.use('/videos', express.static(path.join(__dirname, './uploads/videos')))

// ═══════════════════════════════════════════════════════
//  管理后台登录
// ═══════════════════════════════════════════════════════

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body
  if (password === ADMIN_PASSWORD) {
    const token = generateToken()
    adminTokens.add(token)
    return res.json({ code: 200, data: { token }, msg: '登录成功' })
  }
  res.json({ code: 401, msg: '密码错误' })
})

// ═══════════════════════════════════════════════════════
//  视频接口
// ═══════════════════════════════════════════════════════

// 获取所有视频
app.get('/api/getVideoList', async (req, res) => {
  try {
    const [list] = await db.query('select * from video_list order by id desc')
    res.json({ code: 200, data: list })
  } catch (err) {
    res.json({ code: 500, msg: '获取失败' })
  }
})

// 上传视频文件 + 写入数据库（需管理员 token）
app.post('/api/video/upload', requireAdmin, uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.json({ code: 400, msg: '请选择视频文件' })
    const { title } = req.body
    if (!title) {
      // 上传了文件但没标题，删除文件
      fs.unlinkSync(req.file.path)
      return res.json({ code: 400, msg: '请填写视频标题' })
    }
    const videoPath = '/videos/' + req.file.filename
    await db.query('INSERT INTO video_list (title, video_path) VALUES (?, ?)', [
      title,
      videoPath,
    ])
    res.json({ code: 200, msg: '上传成功', data: { title, video_path: videoPath } })
  } catch (err) {
    console.log('上传视频失败', err)
    res.json({ code: 500, msg: '上传失败' })
  }
})

// 删除视频（同时删除文件，需管理员 token）
app.delete('/api/video/:id', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('select * from video_list where id = ?', [
      req.params.id,
    ])
    if (rows.length === 0) return res.json({ code: 404, msg: '视频不存在' })

    const video = rows[0]
    // 删除物理文件
    const filePath = path.join(
      __dirname,
      './uploads/videos',
      path.basename(video.video_path),
    )
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    await db.query('delete from video_list where id = ?', [req.params.id])
    res.json({ code: 200, msg: '删除成功' })
  } catch (err) {
    console.log('删除视频失败', err)
    res.json({ code: 500, msg: '删除失败' })
  }
})

// 编辑视频标题（需管理员 token）
app.put('/api/video/:id', requireAdmin, async (req, res) => {
  try {
    const { title } = req.body
    if (!title || !title.trim()) {
      return res.json({ code: 400, msg: '标题不能为空' })
    }
    const [result] = await db.query(
      'UPDATE video_list SET title = ? WHERE id = ?',
      [title.trim(), req.params.id],
    )
    if (result.affectedRows === 0) {
      return res.json({ code: 404, msg: '视频不存在' })
    }
    res.json({ code: 200, msg: '更新成功' })
  } catch (err) {
    console.log('编辑视频标题失败', err)
    res.json({ code: 500, msg: '更新失败' })
  }
})

// ═══════════════════════════════════════════════════════
//  留言接口
// ═══════════════════════════════════════════════════════

// 提交联系表单
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.json({ code: 400, msg: '请填写完整信息' })
    }
    await db.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message],
    )

    // 异步发送邮件通知（不阻塞响应）
    sendContactNotification({ name, email, message })

    res.json({ code: 200, msg: '提交成功，我会尽快回复你！' })
  } catch (err) {
    console.log('保存留言失败', err)
    res.json({ code: 500, msg: '提交失败，请稍后重试' })
  }
})

// 获取留言列表（需管理员 token）
app.get('/api/contact/list', requireAdmin, async (req, res) => {
  try {
    const [list] = await db.query(
      'select * from contacts order by created_at desc',
    )
    res.json({ code: 200, data: list })
  } catch (err) {
    res.json({ code: 500, msg: '获取失败' })
  }
})

// 删除留言（需管理员 token）
app.delete('/api/contact/:id', requireAdmin, async (req, res) => {
  try {
    await db.query('delete from contacts where id = ?', [req.params.id])
    res.json({ code: 200, msg: '删除成功' })
  } catch (err) {
    res.json({ code: 500, msg: '删除失败' })
  }
})

// ─── 全局错误处理 ──────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE')
      return res.json({ code: 400, msg: '文件过大，最大支持 500MB' })
    return res.json({ code: 400, msg: err.message })
  }
  if (err) return res.json({ code: 400, msg: err.message })
  next()
})

app.listen(port, () => {
  console.log(`后端服务启动成功：http://localhost:${port}`)
})

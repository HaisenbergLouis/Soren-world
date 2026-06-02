# 🚀 MyWorld 个人品牌作品集网站

## 📌 项目概述

一个功能完备的全栈个人品牌网站，集作品展示、在线简历、联系表单、后台管理于一体。前端采用 **Next.js + TypeScript + Tailwind CSS**，后端使用 **Express + MySQL**，通过 **GSAP** 动画库打造沉浸式滚动交互体验。

---

## 🛠 技术栈

| 层级         | 技术                                              |
| ------------ | ------------------------------------------------- |
| **前端框架** | Next.js 16 (Pages Router) + React 19 + TypeScript |
| **样式方案** | Tailwind CSS v4 + 响应式布局                      |
| **动画引擎** | GSAP (ScrollTrigger) + Lenis 平滑滚动             |
| **状态管理** | Zustand (全局状态)                                |
| **后端框架** | Express.js 5 + Node.js                            |
| **数据库**   | MySQL (mysql2)                                    |
| **文件上传** | Multer (视频文件 500MB 以内)                      |
| **邮件服务** | Nodemailer (QQ邮箱 SMTP)                          |
| **包管理**   | pnpm (Monorepo 工作区)                            |

---

## ✨ 核心功能

### 前端

1. **品牌首页（Home）**
   - 自定义 SVG 动态 Logo（HeisenbergLogo），逐字母发光动画
   - 多区块滚动驱动动画（GSAP ScrollTrigger + stagger 交错效果）
   - 个人信息展示、兴趣卡片（包含抖音 1W+ 粉丝博主展示）
   - Lenis 平滑滚动，全局流畅滚动体验

2. **简历页面（Resume）**
   - 逐字母 3D 翻转标题动画（`rotateX` + `back.out` 缓动）
   - 技能分组展示（前端基础 / React生态 / 样式布局 / 状态管理）
   - 项目经历时间线展示
   - 所有区块均使用 GSAP ScrollTrigger 滚动进入动画

3. **作品展示（Work）**
   - **横向滑动画廊** — 使用 GSAP ScrollTrigger `pin` + 横向偏移实现作品横向滚动浏览
   - 视频懒加载（IntersectionObserver + 提前 200px 预加载）
   - 视频弹窗播放器
   - 进度指示器 + 计数显示
   - Hover 缩放效果 + 播放按钮动画

4. **联系表单（Contact）**
   - 表单验证 + 异步提交
   - 提交成功后 3 秒成功提示
   - 后端同步写入 MySQL + 异步邮件通知

5. **管理后台（Admin）**
   - Token 身份验证（sessionStorage 持久化）
   - 视频管理：上传（拖拽/选择）、编辑标题、删除
   - 留言管理：查看列表、删除留言

### 后端 API

| 接口                | 方法   | 说明                     |
| ------------------- | ------ | ------------------------ |
| `/api/admin/login`  | POST   | 管理员登录               |
| `/api/getVideoList` | GET    | 获取视频列表             |
| `/api/video/upload` | POST   | 上传视频（需 token）     |
| `/api/video/:id`    | DELETE | 删除视频（需 token）     |
| `/api/video/:id`    | PUT    | 编辑视频标题（需 token） |
| `/api/contact`      | POST   | 提交留言                 |
| `/api/contact/list` | GET    | 获取留言列表（需 token） |
| `/api/contact/:id`  | DELETE | 删除留言（需 token）     |

---

## 🏗 项目架构

```
my-world-client/          # 前端 Next.js 应用
├── src/
│   ├── components/       # 可复用组件
│   │   ├── Navbar.tsx        # 响应式导航栏（移动端汉堡菜单）
│   │   ├── HeisenbergLogo.tsx # SVG 动态 Logo
│   │   ├── HorizenSlide.tsx  # 横向视频画廊
│   │   └── SmoothScroll.tsx  # Lenis 平滑滚动
│   ├── pages/            # Next.js Pages Router
│   │   ├── index.tsx         # 首页
│   │   ├── Resume.tsx        # 简历页面
│   │   ├── Work.tsx          # 作品展示
│   │   ├── Contact.tsx       # 联系页面
│   │   └── admin.tsx         # 管理后台
│   ├── lib/
│   │   └── api.ts            # API 封装层
│   └── styles/
│       └── globals.css

my-world-server/          # 后端 Express 服务
├── app.js                # 服务端入口（路由 + 中间件）
├── db.js                 # MySQL 数据库连接池
└── sql/                  # 数据库建表脚本
    ├── create_contacts.sql
    └── create_video_list.sql
```

---

## 🔑 项目亮点

### 1. 沉浸式动画体验

- 使用 **GSAP ScrollTrigger** 实现所有页面的滚动驱动动画
- 首屏逐字母 3D 翻转（`rotateX: -90` → `0`）搭配 `back.out(1.7)` 弹性缓动
- 横向滑动视频画廊，通过 `pin` 固定 + 横向位移实现创新导航方式
- Lenis 平滑滚动引擎，全局一致的阻尼滚动体验

### 2. 性能优化

- 视频 **IntersectionObserver 懒加载**，进入视口前 200px 开始加载
- `preload="none"` 避免一次性加载大量视频
- GSAP `ScrollTrigger.refresh()` 确保动画位置计算准确

### 3. 全栈能力

- 独立完成从数据库设计 → 后端 API → 前端页面的全链路开发
- RESTful 风格 API 设计，统一 `{ code, data, msg }` 响应格式
- Token 鉴权保护管理接口
- 邮件通知与数据库持久化双重保障

### 4. 工程化实践

- pnpm Monorepo 管理前后端
- TypeScript 类型定义（`VideoItem`、`ContactItem` 等接口）
- 组件化开发，API 层与 UI 层解耦
- 响应式设计，适配桌面端与移动端

---

## 📊 项目总结

> **MyWorld** 是一个独立全栈开发的个人品牌作品集网站，展现了前端开发（React / Next.js / TypeScript）、动画开发（GSAP）、后端开发（Express / MySQL）的综合能力。项目从零搭建，自主完成架构设计、组件开发、动画实现与部署，是一个完整的全栈实战项目。

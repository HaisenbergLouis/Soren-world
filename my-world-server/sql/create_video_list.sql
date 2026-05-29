-- 视频作品列表
CREATE TABLE IF NOT EXISTS video_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '视频标题',
  video_path VARCHAR(500) NOT NULL COMMENT '视频文件路径（相对 uploads/videos/）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

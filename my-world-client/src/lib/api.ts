const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/* ===== 管理后台登录 ===== */

/** 获取存储的管理 token */
export function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("admin_token");
  }
  return null;
}

/** 管理员登录 */
export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (data.code === 200) {
    sessionStorage.setItem("admin_token", data.data.token);
    return data.data.token;
  }
  throw new Error(data.msg || "登录失败");
}

/** 退出登录 */
export function adminLogout(): void {
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_auth");
}

/* ===== 视频相关 ===== */

export type VideoItem = {
  id: number;
  title: string;
  video_path: string;
  created_at?: string;
};

/** 获取视频列表 */
export async function getVideoList(): Promise<VideoItem[]> {
  const res = await fetch(`${API_BASE}/api/getVideoList`);
  const data = await res.json();
  if (data.code === 200) return data.data;
  throw new Error(data.msg || "获取视频列表失败");
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { "x-admin-token": token } : {};
}

/** 上传视频 */
export async function uploadVideo(
  file: File,
  title: string,
): Promise<{ title: string; video_path: string }> {
  const formData = new FormData();
  formData.append("video", file);
  formData.append("title", title);

  const res = await fetch(`${API_BASE}/api/video/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (data.code === 200) return data.data;
  throw new Error(data.msg || "上传失败");
}

/** 删除视频 */
export async function deleteVideo(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/video/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (data.code !== 200) throw new Error(data.msg || "删除失败");
}

/** 编辑视频标题 */
export async function updateVideoTitle(
  id: number,
  title: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/video/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (data.code !== 200) throw new Error(data.msg || "更新失败");
}

/** 获取视频完整 URL */
export function getVideoUrl(videoPath: string): string {
  return `${API_BASE}${videoPath}`;
}

/* ===== 留言相关 ===== */

export type ContactItem = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

/** 提交联系表单 */
export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.code === 200) return json.msg;
  throw new Error(json.msg || "提交失败");
}

/** 获取留言列表（后台用） */
export async function getContactList(): Promise<ContactItem[]> {
  const res = await fetch(`${API_BASE}/api/contact/list`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (data.code === 200) return data.data;
  throw new Error(data.msg || "获取留言列表失败");
}

/** 删除留言 */
export async function deleteContact(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/contact/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (data.code !== 200) throw new Error(data.msg || "删除失败");
}

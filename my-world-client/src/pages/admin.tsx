import Head from "next/head";
import { useState, useEffect, useSyncExternalStore } from "react";
import {
  getVideoList,
  uploadVideo,
  deleteVideo,
  updateVideoTitle,
  getContactList,
  deleteContact,
  getVideoUrl,
  adminLogin,
  adminLogout,
} from "@/lib/api";
import type { VideoItem, ContactItem } from "@/lib/api";

type Tab = "videos" | "contacts";

/** 订阅 sessionStorage 中 admin_auth 的变化 */
function useAuth() {
  return useSyncExternalStore(
    () => {
      // sessionStorage 同标签页内不会外部变化，无需订阅
      return () => {};
    },
    // 客户端读取
    () => sessionStorage.getItem("admin_auth") === "true",
    // 服务端（SSR）始终返回 false
    () => false,
  );
}

export default function Admin() {
  const isAuthed = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);
  const [tab, setTab] = useState<Tab>("videos");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogging(true);
    setError("");
    try {
      await adminLogin(password);
      sessionStorage.setItem("admin_auth", "true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLogging(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setPassword("");
  };

  // 未登录 → 显示登录界面
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <Head>
          <title>Admin 登录</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h1 className="text-xl font-bold text-white">后台管理</h1>
            <p className="text-sm text-gray-500 mt-1">请输入密码以继续</p>
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors text-center"
              placeholder="输入管理密码"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={logging}
            className="w-full py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-50"
          >
            {logging ? "验证中..." : "进入管理后台"}
          </button>
        </form>
      </div>
    );
  }

  // ═════════ 已登录 → 显示管理界面 ═════════

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <Head>
        <title>Admin | 后台管理</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">⚙️ 后台管理</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm hover:text-white hover:border-white/20 transition-colors"
          >
            退出登录
          </button>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setTab("videos")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "videos"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🎬 视频管理
          </button>
          <button
            onClick={() => setTab("contacts")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "contacts"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📩 留言管理
          </button>
        </div>

        {tab === "videos" ? <VideoManager /> : <ContactManager />}
      </div>
    </div>
  );
}

/* ===== 视频管理 ===== */
function VideoManager() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const refreshVideos = async () => {
    setLoading(true);
    try {
      const list = await getVideoList();
      setVideos(list);
    } catch {
      setMessage("加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const list = await getVideoList();
        if (!ignore) setVideos(list);
      } catch {
        if (!ignore) setMessage("加载失败");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage("请填写标题并选择视频文件");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      await uploadVideo(file, title);
      setTitle("");
      setFile(null);
      // 重置文件输入
      const input = document.getElementById("video-file") as HTMLInputElement;
      if (input) input.value = "";
      setMessage("✅ 上传成功");
      refreshVideos();
    } catch (err) {
      setMessage(`❌ ${err instanceof Error ? err.message : "上传失败"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该视频吗？")) return;
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    }
  };

  const startEdit = (v: VideoItem) => {
    setEditingId(v.id);
    setEditingTitle(v.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveTitle = async (id: number) => {
    if (!editingTitle.trim()) return;
    try {
      await updateVideoTitle(id, editingTitle.trim());
      setVideos((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, title: editingTitle.trim() } : v,
        ),
      );
      setEditingId(null);
      setEditingTitle("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失败");
    }
  };

  return (
    <div>
      {/* 上传表单 */}
      <form
        onSubmit={handleUpload}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-4"
      >
        <h2 className="text-lg font-semibold mb-2">📤 上传视频</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-1">视频标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors"
            placeholder="输入视频标题"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">视频文件</label>
          <input
            id="video-file"
            type="file"
            accept="video/mp4,video/webm,video/mov,video/avi,video/mkv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-50"
        >
          {uploading ? "上传中..." : "上传视频"}
        </button>

        {message && <p className="text-sm text-gray-400">{message}</p>}
      </form>

      {/* 视频列表 */}
      <h2 className="text-lg font-semibold mb-4">
        已上传视频 ({videos.length})
      </h2>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-500">暂无视频</p>
      ) : (
        <div className="space-y-3">
          {videos.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-4 bg-white/3 border border-white/5 rounded-xl p-4"
            >
              {/* 缩略图（用 video 首帧预览） */}
              <video
                className="w-32 h-20 rounded-lg object-cover bg-gray-800 shrink-0"
                src={getVideoUrl(v.video_path)}
                preload="metadata"
                muted
              />

              <div className="flex-1 min-w-0">
                {editingId === v.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTitle(v.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="flex-1 px-3 py-1.5 bg-white/10 border border-blue-500/50 rounded-lg text-white text-sm outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveTitle(v.id)}
                      className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-xs hover:text-white transition-colors"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer group"
                    onClick={() => startEdit(v)}
                  >
                    <p className="font-medium truncate group-hover:text-blue-400 transition-colors">
                      {v.title}
                      <span className="ml-2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        点击编辑
                      </span>
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-500 truncate">{v.video_path}</p>
              </div>

              <button
                onClick={() => handleDelete(v.id)}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-colors shrink-0"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== 留言管理 ===== */
function ContactManager() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const list = await getContactList();
        if (!ignore) setContacts(list);
      } catch {
        /* ignore */
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该留言吗？")) return;
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        留言列表 ({contacts.length})
      </h2>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">暂无留言</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="bg-white/3 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">
                    {new Date(c.created_at).toLocaleString("zh-CN")}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                {c.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

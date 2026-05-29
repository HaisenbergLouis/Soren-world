import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getVideoList, getVideoUrl } from "@/lib/api";
import type { VideoItem } from "@/lib/api";
gsap.registerPlugin(ScrollTrigger);

/* ===== 懒加载视频组件 ===== */
function LazyVideo({ src, className }: { src: string; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || loaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = src; // 进入视口才加载视频
          el.load();
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }, // 提前 200px 加载，体验更顺滑
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [src, loaded]);

  return (
    <video
      ref={videoRef}
      className={className}
      preload="none"
      loop
      playsInline
      muted
    />
  );
}

/* ===== 进度指示器小组件 ===== */
function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-500 ${
            i === current ? "w-6 bg-blue-400" : "bg-white/20 hover:bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

export default function HorizenSlide() {
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const scrollProgress = useRef(0);
  const lastIndexRef = useRef(0);

  // 获取视频
  useEffect(() => {
    getVideoList()
      .then((list) => setVideoList(list))
      .catch((err) => console.log("获取视频失败", err));
  }, []);

  // 打开弹窗
  const openModal = (video: VideoItem) => {
    setCurrentVideo(getVideoUrl(video.video_path));
    setCurrentTitle(video.title);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVideo("");
    setCurrentTitle("");
  };

  // 横向滑动 — 用 pin 固定，双向平滑
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const cards = cardsRef.current;
    if (!wrapper || !cards || videoList.length === 0) return;

    const scrollDistance = cards.scrollWidth - window.innerWidth;
    if (scrollDistance <= 0) return;

    const animation = gsap.to(cards, {
      x: -scrollDistance,
      ease: "none",
    });

    const st = ScrollTrigger.create({
      trigger: wrapper,
      pin: true,
      start: "top top",
      end: () => "+=" + scrollDistance,
      scrub: true,
      animation,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        const idx = Math.round(self.progress * (videoList.length - 1));
        const clamped = Math.min(idx, videoList.length - 1);
        if (clamped !== lastIndexRef.current) {
          lastIndexRef.current = clamped;
          setActiveIndex(clamped);
        }
      },
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
      animation.kill();
    };
  }, [videoList]);

  return (
    <section ref={sectionRef} className="relative">
      {/* 区段标题 */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <div className="text-xs text-blue-400/60 tracking-[0.3em] uppercase mb-2">
          Portfolio
        </div>
        <div className="text-2xl md:text-3xl font-bold text-white/80">
          Featured Works
        </div>
      </div>

      {/* ===== 主体：横向滚动区 ===== */}
      <div ref={wrapperRef} className="bg-black relative">
        {/* 视频计数 */}
        <div className="absolute top-24 right-8 z-30 text-right pointer-events-none hidden md:block">
          <span className="text-5xl font-bold text-white/10">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-sm text-gray-600 ml-1">
            / {String(videoList.length).padStart(2, "0")}
          </span>
        </div>

        {/* 进度指示器 — 在 pinned 容器内，固定期间停驻，释放后一起滚走 */}
        {videoList.length > 0 && (
          <ProgressDots total={videoList.length} current={activeIndex} />
        )}

        <div className="h-screen flex items-center overflow-hidden">
          <div ref={cardsRef} className="flex gap-6 px-[10vw]">
            {videoList.map((video, i) => (
              <div
                key={video.id}
                className="group relative h-[55vh] w-175 shrink-0 cursor-pointer rounded-2xl overflow-hidden bg-gray-900 border border-white/5 hover:border-blue-500/30 transition-all duration-500"
                onClick={() => openModal(video)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 视频（懒加载） */}
                <LazyVideo
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredIndex === i ? "scale-110" : "scale-100"
                  }`}
                  src={getVideoUrl(video.video_path)}
                />

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* 播放按钮 */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center transition-all duration-500 ${
                    hoveredIndex === i
                      ? "opacity-100 scale-100 bg-blue-500/20 border-blue-400/60"
                      : "opacity-0 scale-75"
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* 底部信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-blue-400/80 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="w-8 h-px bg-blue-400/40" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white/90 tracking-wide">
                    {video.title}
                  </h3>
                </div>

                {/* 序号角标（hover 显示） */}
                <div
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-sm text-white/60 font-mono transition-all duration-500 ${
                    hoveredIndex === i
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-50"
                  }`}
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 视频弹窗 ===== */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
          onClick={closeModal}
        >
          {/* 关闭按钮 */}
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 z-10"
            onClick={closeModal}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 视频标题 */}
          <div className="absolute top-6 left-6 text-left pointer-events-none z-10">
            <p className="text-xs text-blue-400/60 tracking-[0.2em] uppercase mb-1">
              Now Playing
            </p>
            <p className="text-xl font-bold text-white">{currentTitle}</p>
          </div>

          {/* 视频 */}
          <div
            className="w-[90%] max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="w-full h-full object-contain bg-black"
              src={currentVideo}
              autoPlay
              controls
              loop
              playsInline
            />
          </div>

          {/* 底部提示 */}
          <p className="absolute bottom-8 text-gray-600 text-xs tracking-wider">
            Click anywhere outside the video to close
          </p>
        </div>
      )}
    </section>
  );
}

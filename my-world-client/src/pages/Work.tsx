import Head from "next/head";
import HorizenSlide from "@/components/HorizenSlide";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Work() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = titleRef.current?.querySelectorAll("span");
      if (letters) {
        gsap.fromTo(
          letters,
          { opacity: 0, y: 80, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.07,
            ease: "back.out(1.7)",
          },
        );
      }
      if (tagRef.current) {
        gsap.fromTo(
          tagRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" },
        );
      }
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.8, ease: "power3.out" },
        );
      }
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 1.4, ease: "power3.out" },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const workTitle = "Music Videos".split("");

  return (
    <div className="overflow-x-hidden bg-black text-white">
      <Head>
        <title>Works | Soren Lu — MV 作品集</title>
        <meta
          name="description"
          content="浏览 Soren Lu 的音乐视频剪辑作品合集 — 每一帧都贴合节奏与情感。"
        />
      </Head>
      {/* ═══════ Hero Section ═══════ */}
      <Navbar />

      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center bg-linear-to-b from-gray-600 to-black"
      >
        {/* 背景光晕 */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center px-6 z-10">
          {/* 标签 */}
          <div
            ref={tagRef}
            className="mb-6 inline-block px-5 py-2 border border-blue-400/30 rounded-full text-blue-400 text-xs tracking-[0.2em] uppercase opacity-0"
          >
            Music Video Editor
          </div>

          {/* 标题逐字动画 */}
          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider flex flex-wrap justify-center gap-x-4 perspective-midrange mb-6"
          >
            {workTitle.map((letter, i) => (
              <span
                key={i}
                className="inline-block opacity-0"
                style={{
                  color: i < 5 ? "#60a5fa" : "#fff",
                  textShadow:
                    i < 5
                      ? "0 0 40px rgba(96,165,250,0.5)"
                      : "0 0 20px rgba(255,255,255,0.2)",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-2xl text-gray-400 tracking-[0.15em] opacity-0"
          >
            Visual Stories · Rhythms & Beats
          </p>

          <p
            ref={descRef}
            className="mt-6 text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed opacity-0"
          >
            Scroll down to explore my collection of music video edits —
            <br />
            each frame crafted to match the rhythm and emotion of the track.
          </p>
        </div>

        {/* 向下指示箭头 */}
        <div className="absolute bottom-10 animate-bounce z-10">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ═══════ 视频画廊（横向滑动）═══════ */}
      <HorizenSlide />

      {/* ═══════ Ending Section ═══════ */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-linear-to-b from-black to-gray-900 px-6">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-120 h-120 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Let&apos;s <span className="text-blue-400">Create</span>
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            Got a track that needs visuals? I&apos;d love to work with you.
          </p>
          <Link
            href="/Contact"
            className="inline-block px-8 py-4 border border-blue-400/30 text-blue-400 rounded-xl font-semibold tracking-wider uppercase hover:bg-blue-500/10 hover:border-blue-400/50 transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>&copy; 2026 Soren Lu. All rights reserved.</p>
      </footer>
    </div>
  );
}

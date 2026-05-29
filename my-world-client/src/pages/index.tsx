import Head from "next/head";
import HeisenbergLogo from "@/components/HeisenbergLogo";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  {
    href: "/Resume",
    label: "Resume",
    desc: "My background & skills",
    icon: "📄",
  },
  {
    href: "/Work",
    label: "Works",
    desc: "Music video portfolio",
    icon: "🎬",
  },
  {
    href: "/Contact",
    label: "Contact",
    desc: "Let's work together",
    icon: "✉️",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const interestRef = useRef<HTMLDivElement>(null);

  // Hero 进入动画
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (taglineRef.current) {
        gsap.fromTo(
          taglineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1.5, ease: "power3.out" },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // 滚动驱动动画
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 导航卡片
      const cards = cardsRef.current?.querySelectorAll(".nav-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      }
      // 信息条目
      const infoItems = infoRef.current?.querySelectorAll(".info-item");
      if (infoItems) {
        gsap.fromTo(
          infoItems,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: infoRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      }
      // 兴趣卡片
      const interestCards =
        interestRef.current?.querySelectorAll(".interest-card");
      if (interestCards) {
        gsap.fromTo(
          interestCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: interestRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-x-hidden bg-black text-white">
      <Head>
        <title>Soren Lu | 前端开发学习者 &amp; MV 剪辑</title>
        <meta
          name="description"
          content="Soren Lu 的个人作品集 — 前端开发学习者，主攻 React + TypeScript 技术栈，兼音乐视频剪辑创作者。"
        />
      </Head>
      <Navbar />

      {/* ═══════ Hero Section ═══════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center bg-linear-to-b from-gray-600 to-black"
      >
        {/* 背景光晕 */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo 动画 */}
        <div className="scale-75 md:scale-100">
          <HeisenbergLogo />
        </div>

        {/* 标语 */}
        <p
          ref={taglineRef}
          className="mt-6 text-lg md:text-xl text-gray-400 tracking-[0.2em] uppercase opacity-0"
        >
          Music Video Editor · Front-end Developer
        </p>

        {/* 向下箭头 */}
        <div className="absolute bottom-10 animate-bounce">
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

      {/* ═══════ About Section ═══════ */}
      <section className="min-h-screen bg-linear-to-b from-black to-gray-900 px-6 py-24 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-blue-400">/</span> about me
          </h2>
          <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full mb-16" />

          <div ref={infoRef} className="space-y-8 text-left max-w-2xl mx-auto">
            <div className="info-item opacity-0 bg-white/3 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                <span>🎓</span> 在校学习
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                主修课程：计算机网络 · 计算机组成原理 · 数据结构 ·
                数据库系统及原理
              </p>
              <p className="text-gray-500 text-sm mt-2">英语水平：CET-4</p>
            </div>

            <div className="info-item opacity-0 bg-white/3 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                <span>💻</span> 前端方向
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                前端开发学习者，主攻{" "}
                <span className="text-blue-400">React</span>{" "}
                <span className="text-blue-400">TypeScript</span> 技术栈。
                熟悉状态管理、前后端交互与组件开发。热爱编程，注重代码规范与逻辑思维。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Interests Section ═══════ */}
      <section
        ref={interestRef}
        className="min-h-screen bg-linear-to-b from-gray-900 to-black px-6 py-24 flex flex-col items-center justify-center"
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> interests
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="interest-card opacity-0 bg-white/3 border border-white/5 rounded-2xl p-8 text-center backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 group">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-500">
                🎨
              </div>
              <h3 className="text-lg font-bold mb-3 text-white/90 group-hover:text-blue-400 transition-colors duration-500">
                视觉美学
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                热衷于 Web 图形与创意视觉，通过 CSS / Canvas
                等前端技术创造富有美感的动态画面与视觉效果
              </p>
            </div>

            <div className="interest-card opacity-0 bg-white/3 border border-white/5 rounded-2xl p-8 text-center backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 group">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-500">
                🎬
              </div>
              <h3 className="text-lg font-bold mb-3 text-white/90 group-hover:text-blue-400 transition-colors duration-500">
                音乐视频剪辑
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                热爱音乐与影像的结合，擅长将节奏与画面融合，创作富有情感的音乐视频
              </p>
            </div>

            <div className="interest-card opacity-0 bg-white/3 border border-white/5 rounded-2xl p-8 text-center backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 group">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-500">
                🎵
              </div>
              <h3 className="text-lg font-bold mb-3 text-white/90 group-hover:text-blue-400 transition-colors duration-500">
                抖音博主
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                抖音 <span className="text-blue-400 font-semibold">1W+</span>{" "}
                粉丝博主，持续创作音乐视频内容，懂得如何用内容打动观众
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Quick Links ═══════ */}
      <section className="min-h-screen bg-linear-to-b from-gray-900 to-black px-6 py-24 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> explore
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="nav-card opacity-0 bg-white/3 border border-white/5 rounded-2xl p-10 text-center backdrop-blur-sm hover:border-blue-500/30 hover:bg-white/6 transition-all duration-500 cursor-pointer group h-full">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {link.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white/90 group-hover:text-blue-400 transition-colors duration-500">
                    {link.label}
                  </h3>
                  <p className="text-gray-500 text-sm">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Soren Lu. All rights reserved.</p>
      </footer>
    </div>
  );
}

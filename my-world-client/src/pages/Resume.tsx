import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ===== 数据 ===== */
const personalInfo = {
  name: "Soren Lu",
  alias: "Soren Lu",
  age: 20,
  location: "Lanzhou Gansu",
  phone: "15352014697",
  email: "3542957547@qq.com",
  title: "前端开发学习者",
  target: "前端开发实习生",
  summary:
    "主攻 React + TypeScript 技术栈的前端开发学习者。熟练使用 Next.js 进行项目搭建与业务开发，精通 React 函数组件与 Hooks，掌握 Zustand 状态管理。具备良好的组件化开发思维，能独立排查 TS 类型报错与样式 Bug。热爱前端技术，追求代码质量，期待在前端实习岗位中持续成长。",
};

const skillGroups = [
  {
    title: "前端基础",
    icon: "🌐",
    items: [
      "熟练掌握 HTML5 / CSS3 / JavaScript / TypeScript",
      "熟悉 TS 类型定义、类型校验与空值处理",
    ],
  },
  {
    title: "React 生态",
    icon: "⚛️",
    items: [
      "精通 React 函数组件 + Hooks 开发",
      "熟练使用 Next.js (Pages Router) 项目搭建、文件路由、客户端业务开发",
    ],
  },
  {
    title: "样式 & 布局",
    icon: "🎨",
    items: [
      "熟练使用 Tailwind CSS 快速实现响应式布局、弹性居中、粘性定位",
      "能独立修复页面遮挡、布局错位等兼容问题",
    ],
  },
  {
    title: "状态管理 & 工程化",
    icon: "🧩",
    items: [
      "熟练使用 Zustand 做全局状态管理，掌握状态模块化、本地持久化",
      "实现登录态、购物车、订单数据全局共享",
      "具备良好组件化、模块化开发思想，代码结构清晰",
      "可独立排查 TS 类型报错、页面样式 Bug",
    ],
  },
];

const experiences = [
  {
    period: "2025 - 至今",
    company: "个人项目 · 独立开发",
    role: "前端开发者",
    items: [
      "独立开发个人作品集网站（MyWorld），使用 Next.js + TypeScript + Tailwind CSS",
      "集成 GSAP ScrollTrigger 实现横向滑动、滚动驱动动画等丰富交互效果",
      "对接后端 API 实现视频展示、联系表单提交等功能",
      "全程自主完成项目搭建、组件设计、动画开发与部署",
    ],
  },
  {
    period: "2024 - 2025",
    company: "前端学习项目",
    role: "前端开发者（自学）",
    items: [
      "系统学习 React 函数组件、Hooks、状态管理等核心概念",
      "基于 Next.js 搭建多个实战项目，掌握 Pages Router 文件路由与业务开发",
      "使用 Zustand 实现全局状态管理，完成登录态、购物车等状态模块化",
      "通过 TypeScript 强化类型思维，养成类型定义与类型校验的编码习惯",
    ],
  },
  {
    period: "2023 - 2024",
    company: "前端入门阶段",
    role: "前端初学者",
    items: [
      "从 HTML / CSS / JavaScript 基础开始，逐步掌握前端三件套",
      "学习响应式布局与 Tailwind CSS，完成多个静态页面实战",
      "接触 React 框架，理解组件化开发思想与 SPA 原理",
      "通过实际项目练习 Git 版本控制与代码规范",
    ],
  },
];

const projects = [
  {
    name: "MyWorld 个人作品集",
    tech: "Next.js · TypeScript · GSAP · Tailwind CSS",
    desc: "个人品牌网站，包含作品展示、简历与联系功能。采用横向滚动画廊展示视频作品，集成 Lenis 平滑滚动与 GSAP 动画，实现流畅的滚动驱动交互体验。",
  },
  {
    name: "在线商城 Demo",
    tech: "React · Zustand · Tailwind CSS",
    desc: "全功能电商前端 Demo，实现商品展示、购物车管理、登录状态持久化。使用 Zustand 进行状态模块化管理，完成购物车数据与登录态的全局共享与本地持久化。",
  },
  {
    name: "待办事项管理应用",
    tech: "React · TypeScript · LocalStorage",
    desc: "功能完整的 Todo 管理应用，支持任务的增删改查、分类筛选与状态管理。使用 TypeScript 进行类型定义，确保代码健壮性，数据持久化存储于 LocalStorage。",
  },
];

const education = [
  {
    period: "2023 - 至今",
    school: "自学前端开发",
    degree: "React / TypeScript / Next.js 技术栈",
  },
];

export default function Resume() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);

  // Hero 进入动画
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
            stagger: 0.06,
            ease: "back.out(1.7)",
          },
        );
      }
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1.2, ease: "power3.out" },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // 滚动驱动动画：通用工厂
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = [
        { ref: profileRef, sel: ".profile-card", x: -50 },
        { ref: skillsRef, sel: ".skill-bar", x: 60 },
        { ref: expRef, sel: ".exp-card", x: -50 },
        { ref: projectRef, sel: ".project-card", x: 60 },
        { ref: eduRef, sel: ".edu-card", x: -50 },
      ];
      sections.forEach(({ ref, sel, x }) => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(
          el.querySelectorAll(sel),
          { opacity: 0, x },
          {
            opacity: 1,
            x: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const heroName = "Soren Lu".split("");

  return (
    <div className="overflow-x-hidden bg-black text-white">
      <Head>
        <title>Resume | Soren Lu — 简历</title>
        <meta
          name="description"
          content="Soren Lu 的前端开发简历 — 技能、项目经验与教育背景。"
        />
      </Head>
      <Navbar />

      {/* ═══════════ Hero Section ═══════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center bg-linear-to-b from-gray-600 to-black"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center px-6">
          {/* 职业标签 */}
          <div
            className="mb-6 inline-block px-5 py-2 border border-blue-400/30 rounded-full text-blue-400 text-sm tracking-[0.15em] uppercase opacity-0"
            ref={subtitleRef}
          >
            {personalInfo.title}
          </div>

          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider flex flex-wrap justify-center gap-x-4 perspective-midrange mb-6"
          >
            {heroName.map((letter, i) => (
              <span
                key={i}
                className="inline-block opacity-0"
                style={{
                  color: i < 6 ? "#60a5fa" : "#fff",
                  textShadow:
                    i < 6
                      ? "0 0 40px rgba(96,165,250,0.5)"
                      : "0 0 20px rgba(255,255,255,0.2)",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>

          <p className="text-lg md:text-xl text-gray-400 tracking-[0.15em]">
            {personalInfo.alias} · {personalInfo.age} yrs ·{" "}
            {personalInfo.location}
          </p>
        </div>

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

      {/* ═══════════ Profile Section ═══════════ */}
      <section
        ref={profileRef}
        className="min-h-screen bg-linear-to-b from-black to-gray-900 px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> about
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 基本信息 */}
            <div className="profile-card opacity-0 col-span-1 bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Basic Info
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Name", value: "Soren Lu" },
                  { label: "Age", value: `${personalInfo.age}` },
                  { label: "Location", value: personalInfo.location },
                  { label: "Phone", value: personalInfo.phone },
                  { label: "Email", value: personalInfo.email },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-gray-300 text-sm text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 意向岗位 + 个人总结 */}
            <div className="profile-card opacity-0 col-span-2 space-y-6">
              <div className="bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Target Position
                </h3>
                <p className="text-2xl font-bold text-blue-400">
                  {personalInfo.target}
                </p>
              </div>

              <div className="bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Summary
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {personalInfo.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Skills Section ═══════════ */}
      <section
        ref={skillsRef}
        className="min-h-screen bg-linear-to-b from-gray-900 to-black px-6 py-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> skills
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="skill-bar opacity-0 bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/20 transition-colors duration-500"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{group.icon}</span>
                  <h3 className="text-lg font-bold text-white/90">
                    {group.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Experience Section ═══════════ */}
      <section
        ref={expRef}
        className="min-h-screen bg-linear-to-b from-black to-gray-900 px-6 py-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> experience
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div className="space-y-8">
            {experiences.map((exp) => (
              <div
                key={exp.period}
                className="exp-card opacity-0 bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/20 transition-colors duration-500"
              >
                <div className="flex flex-wrap items-baseline justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{exp.company}</h3>
                    <p className="text-blue-400 text-sm">{exp.role}</p>
                  </div>
                  <span className="text-gray-500 text-sm border border-white/10 px-3 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-2">
                  {exp.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-400"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Projects Section ═══════════ */}
      <section
        ref={projectRef}
        className="min-h-screen bg-linear-to-b from-gray-900 to-black px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> projects
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.name}
                className="project-card opacity-0 bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/20 hover:bg-white/6 transition-all duration-500 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors duration-500">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                <p className="text-xs text-blue-400/70 mb-3 tracking-wider">
                  {project.tech}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Education Section ═══════════ */}
      <section
        ref={eduRef}
        className="min-h-screen bg-linear-to-b from-black to-gray-900 px-6 py-24"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> education
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div
                key={edu.period}
                className="edu-card opacity-0 bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/20 transition-colors duration-500 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-1">{edu.school}</h3>
                <p className="text-blue-400 text-sm mb-3">{edu.degree}</p>
                <span className="text-gray-500 text-sm">{edu.period}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Footer ═══════════ */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>&copy; 2026 Soren Lu. All rights reserved.</p>
      </footer>
    </div>
  );
}

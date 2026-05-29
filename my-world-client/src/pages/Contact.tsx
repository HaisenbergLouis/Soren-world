import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { submitContact } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

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
            stagger: 0.08,
            ease: "back.out(1.7)",
          },
        );
      }
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1, ease: "power3.out" },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // 表单和信息滚动动画
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.querySelectorAll(".info-item"),
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            duration: 1,
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
      if (formRef.current) {
        gsap.fromTo(
          formRef.current.querySelectorAll(".form-field"),
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await submitContact({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      });
      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "提交失败，请检查后端是否启动",
      );
    } finally {
      setSending(false);
    }
  };

  const contactTitle = "Get In Touch".split("");

  return (
    <div className="overflow-x-hidden bg-black text-white">
      <Head>
        <title>Contact | Soren Lu — 联系我</title>
        <meta
          name="description"
          content="与 Soren Lu 取得联系 — 无论是合作还是交流，都欢迎来信。"
        />
      </Head>
      <Navbar />

      {/* ========== Hero Section ========== */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center bg-linear-to-b from-gray-600 to-black"
      >
        {/* 背景装饰光晕 */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider flex flex-wrap justify-center gap-x-4 perspective-midrange"
        >
          {contactTitle.map((letter, i) => (
            <span
              key={i}
              className="inline-block opacity-0"
              style={{
                color: i < 3 ? "#60a5fa" : "#fff",
                textShadow:
                  i < 3
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
          className="mt-8 text-lg md:text-xl text-gray-400 tracking-[0.2em] uppercase opacity-0"
        >
          Let&apos;s create something amazing together
        </p>

        {/* 向下指示箭头 */}
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

      {/* ========== Contact Section ========== */}
      <section
        ref={formSectionRef}
        className="min-h-screen bg-linear-to-b from-black to-gray-900 px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-400">/</span> contact
            </h2>
            <div className="w-20 h-1 bg-blue-400/50 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* ===== 左侧：联系信息 ===== */}
            <div ref={infoRef} className="space-y-10">
              <div className="info-item opacity-0 flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors duration-500">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email</h3>
                  <p className="text-gray-400 text-sm">3542957547@qq.com</p>
                </div>
              </div>

              <div className="info-item opacity-0 flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors duration-500">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Location</h3>
                  <p className="text-gray-400 text-sm">Lanzhou, Gansu</p>
                </div>
              </div>

              <div className="info-item opacity-0 flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors duration-500">
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
                      d="M22 5.5l-9 5.25L4 5.5M4 5.5V18a1 1 0 001 1h14a1 1 0 001-1V5.5M4 5.5l9 5.25 9-5.25"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15.5V20M8 17.5h8"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Phone</h3>
                  <p className="text-gray-400 text-sm">15352014697</p>
                </div>
              </div>

              <div className="info-item opacity-0 flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors duration-500">
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
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">WeChat</h3>
                  <p className="text-gray-400 text-sm">Godfather_LuHX</p>
                </div>
              </div>

              <div className="info-item opacity-0 flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors duration-500">
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
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Social</h3>
                  <div className="flex gap-4 mt-2">
                    <a
                      href="https://v.douyin.com/8Dwl_EVWwv0/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs text-gray-400 hover:bg-blue-500/20 hover:text-blue-400 cursor-pointer transition-all duration-300"
                      title="抖音主页"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== 右侧：联系表单 ===== */}
            <div ref={formRef}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-field opacity-0">
                  <label className="block text-sm text-gray-400 mb-2 tracking-wider uppercase">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>

                <div className="form-field opacity-0">
                  <label className="block text-sm text-gray-400 mb-2 tracking-wider uppercase">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-field opacity-0">
                  <label className="block text-sm text-gray-400 mb-2 tracking-wider uppercase">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-300 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <div className="form-field opacity-0">
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl font-semibold tracking-wider uppercase hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {sending
                        ? "Sending..."
                        : submitted
                          ? "✓ Message Sent!"
                          : "Send Message"}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>&copy; 2026 Soren Lu. All rights reserved.</p>
      </footer>
    </div>
  );
}

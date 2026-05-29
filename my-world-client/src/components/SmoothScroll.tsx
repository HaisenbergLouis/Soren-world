import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 禁用浏览器默认的滚动位置恢复，避免刷新后与 Lenis 状态冲突
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // 立即恢复到顶部，防止浏览器恢复旧位置造成闪烁
    window.scrollTo(0, 0);

    // 初始化 Lenis — 阻尼平滑滚动
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // 初始化后立即滚动到顶部，覆盖任何残留的浏览器恢复位置
    lenis.scrollTo(0, { immediate: true });

    // 连接 Lenis 与 GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker 驱动 Lenis 刷新
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 首次启动后刷新 ScrollTrigger，确保位置计算正确
    requestAnimationFrame(() => ScrollTrigger.refresh());

    // 监听路由变化：页面跳转时回到顶部并刷新 ScrollTrigger
    const handleRouteChange = () => {
      // 强制滚动到顶部（原生 + Lenis）
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });

      // 确保 Lenis 处于运行状态
      lenis.start();

      // 重新计算所有 ScrollTrigger
      ScrollTrigger.refresh();
    };

    // 路由变化完成时触发
    router.events.on("routeChangeComplete", handleRouteChange);
    // 也要处理 hash 变更等情况
    router.events.on("hashChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
      lenisRef.current = null;
      lenis.destroy();
      gsap.ticker.lagSmoothing(1);
    };
  }, [router.events]);

  return <>{children}</>;
}

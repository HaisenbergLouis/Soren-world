import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* 标签栏图标 */}
        <link rel="icon" href="/Logo.svg" type="image/svg+xml" />
        {/* 备用图标（兼容不支持 SVG 的浏览器） */}
        <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

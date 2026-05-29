import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/Resume", label: "Resume" },
  { href: "/Work", label: "Works" },
  { href: "/Contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="w-full fixed flex justify-between items-center px-6 md:px-8 py-2.5 z-50 text-white">
      {/* 左侧品牌名 */}
      <Link href={"/"}>
        <p
          className={`text-lg font-bold tracking-wider transition-colors duration-300 ${
            router.pathname === "/"
              ? "text-blue-400"
              : "text-white hover:text-blue-400"
          }`}
        >
          Soren Lu
        </p>
      </Link>

      {/* 桌面端导航 */}
      <div className="hidden md:flex gap-6">
        {navLinks
          .filter((l) => l.href !== "/")
          .map((link) => (
            <Link key={link.href} href={link.href}>
              <p
                className={`relative text-sm tracking-wider uppercase transition-colors duration-300 cursor-pointer ${
                  isActive(link.href)
                    ? "text-blue-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />
                )}
              </p>
            </Link>
          ))}
      </div>

      {/* 移动端汉堡按钮 */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 group"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
            menuOpen ? "rotate-45 translate-y-1.25" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-1.25" : ""
          }`}
        />
      </button>

      {/* 移动端下拉菜单 */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/5 transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <p
                onClick={() => setMenuOpen(false)}
                className={`py-2 text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isActive(link.href)
                    ? "text-blue-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

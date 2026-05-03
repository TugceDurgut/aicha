"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const navItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Villalar", href: "/villas" },
    { label: "Hakkımızda", href: "/about" },
    { label: "İletişim", href: "/contact" },
  ];

  const isLightHeader = scrolled || !isHome || menuOpen;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isLightHeader
          ? "bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <Image
            src={"/images/logo.png"}
            alt="Aicha Villas"
            width={56}
            height={56}
            priority
            className="transition-all duration-300"
          />

          <span className="block text-lg font-bold tracking-wide text-[#373889]">
            AICHA VILLAS
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-semibold tracking-wide transition-colors ${
                  active
                    ? "text-[#D62AA0] hover:text-[#D62AA0]"
                    : "text-[#373889] hover:text-[#D62AA0]"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-[#D62AA0]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/villas"
            className="rounded-xl bg-[#373889] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#373889]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D62AA0]"
          >
            Villaları Gör
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`md:hidden transition-colors ${
            isLightHeader ? "text-[#373889]" : "text-white"
          }`}
          aria-label="Menüyü aç"
        >
          <div className="relative h-5 w-6">
            <span
              className={`absolute left-0 h-[2px] w-full bg-[#373889] transition-all duration-300 ${
                menuOpen ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-[2px] w-full bg-[#373889] transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-[2px] w-full bg-[#373889] transition-all duration-300 ${
                menuOpen ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </div>
        </button>
      </div>

      <div
        className={`overflow-hidden bg-white shadow-md transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 bg-white/90">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-black/5 py-4 text-base font-semibold text-[#373889] last:border-b-0"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/villas"
            onClick={() => setMenuOpen(false)}
            className="mt-4 rounded-xl bg-[#373889] px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Villaları Gör
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

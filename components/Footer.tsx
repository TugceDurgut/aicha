"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#373889] text-white">
      <div className="max-w-7xl mx-auto px-3 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <Image
              src={"/images/logo-white.png"}
              alt="Aicha Villas"
              width={60}
              height={60}
              className="transition-all duration-300"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-center">
            <div className="flex flex-wrap text-center justify-center gap-4 md:grid md:grid-cols-4 md:gap-5">
              <Link
                href="/"
                className="text-white/75 hover:text-white transition"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/villas"
                className="text-white/75 hover:text-white transition"
              >
                Villalar
              </Link>
              <Link
                href="/about"
                className="text-white/75 hover:text-white transition"
              >
                Hakkımızda
              </Link>
              <Link
                href="/contact"
                className="text-white/75 hover:text-white transition"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 h-px bg-white/10" />

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <div>
            © {new Date().getFullYear()} Aicha Villas. Tüm hakları saklıdır.
          </div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition">
              Gizlilik Politikası
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

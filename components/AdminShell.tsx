"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  user: {
    name: string | null;
    email: string;
  };
  newMessagesCount: number;
};

export default function AdminShell({
  children,
  user,
  newMessagesCount,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      isActive: pathname === "/admin",
    },
    {
      href: "/admin/listings",
      label: "Villalar",
      isActive: pathname.includes("/admin/listings"),
    },
    {
      href: "/admin/reservations",
      label: "Rezervasyonlar",
      isActive: pathname.includes("/admin/reservations"),
    },
    {
      href: "/admin/messages",
      label: "Mesajlar",
      isActive: pathname.includes("/admin/messages"),
      badge: newMessagesCount > 0 ? newMessagesCount : null,
    },
  ];

  const displayName = user.name || user.email || "Admin";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleNavigate = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-[72px] items-center border-b border-black/10 bg-white px-4 md:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-[#F5F6FA]"
            aria-label="Menüyü aç"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          </button>
        </div>

        <Link href="/" className="flex items-center md:ml-15">
          <Image
            src="/images/logo.png"
            alt="Aicha Villas"
            width={50}
            height={50}
          />
        </Link>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm text-gray-700">{displayName}</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#373889] text-sm font-medium text-white">
            {avatarLetter}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center rounded-xl p-2 text-red-500 transition hover:bg-red-50"
            aria-label="Çıkış yap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Menüyü kapat"
          />

          <aside className="absolute left-0 top-0 h-full w-[280px] bg-white px-5 py-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="text-lg font-semibold text-[#1F2937]">
                Admin Menü
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-[#F5F6FA]"
                aria-label="Kapat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                    item.isActive
                      ? "bg-[#EEF0FF] font-medium text-[#373889]"
                      : "text-gray-600 hover:bg-[#F5F6FA]"
                  }`}
                >
                  <span className="text-sm">{item.label}</span>

                  {"badge" in item && item.badge ? (
                    <span className="inline-flex min-w-[24px] items-center justify-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex h-full pt-[72px]">
        <aside className="fixed left-0 top-[72px] hidden h-[calc(100vh-72px)] w-[260px] border-r border-black/5 bg-white px-6 py-8 md:block">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                  item.isActive
                    ? "bg-[#EEF0FF] font-medium text-[#373889]"
                    : "text-gray-600 hover:bg-[#F5F6FA]"
                }`}
              >
                <span className="text-sm">{item.label}</span>

                {"badge" in item && item.badge ? (
                  <span className="inline-flex min-w-[24px] items-center justify-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="h-[calc(100vh-72px)] w-full overflow-y-auto p-4 md:ml-[260px] md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

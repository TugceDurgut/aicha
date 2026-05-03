"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message);
        return;
      }

      router.push("/admin");
    } catch {
      alert("Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-[#373889] lg:flex">
        <Image
          src="/images/logo-white.png"
          alt="Logo"
          width={260}
          height={100}
          priority
          className="mb-8 h-auto w-auto"
        />
      </div>

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-2xl font-semibold text-[#373889]">
            Admin Giriş
          </h1>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-3 outline-none"
            />

            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-3 outline-none"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-[#373889] py-3 text-white disabled:opacity-70"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>

            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

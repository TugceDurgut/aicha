"use client";

import { useState } from "react";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:\+90|0)?[5][0-9]{9}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!emailRegex.test(email.trim())) {
        setErrorMessage("Geçerli bir e-posta adresi girin.");
        return;
      }

      const normalizedPhone = phone.replace(/\s/g, "");

      if (!phoneRegex.test(normalizedPhone)) {
        setErrorMessage("Geçerli bir telefon numarası girin.");
        return;
      }
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          message,
          company: "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Mesaj gönderilemedi.");
        return;
      }

      setSuccessMessage("Mesajınız başarıyla gönderildi.");
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setErrorMessage("Mesaj gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F8FC] py-36">
      <div className="mx-auto max-w-3xl space-y-8 px-6">
        <h1 className="text-4xl font-light tracking-wide text-[#1F2937] md:text-5xl">
          İletişim
        </h1>

        <form
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ad Soyad"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon"
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınız"
            rows={5}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="text"
            name="company"
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
          />

          {successMessage && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            className="w-full rounded-xl bg-[#373889] py-3 text-white"
            disabled={loading}
          >
            {loading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>

        <div className="space-y-2 text-center text-sm text-gray-600">
          <div>Email: info@aıchainşaat.com</div>
          <div>Telefon: +90 537 951 05 26</div>
        </div>

        <div className="text-center">
          <a
            href="https://wa.me/905550000000"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-green-50 px-5 py-2 text-green-700"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

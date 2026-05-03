"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminListingForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [guestCapacity, setGuestCapacity] = useState("");
  const [bedroomCount, setBedroomCount] = useState("");
  const [bedCount, setBedCount] = useState("");
  const [bathroomCount, setBathroomCount] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isDisabled = !title || !slug || !guestCapacity || !basePrice || loading;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title,
          shortDescription,
          description,
          city,
          district,
          guestCapacity: Number(guestCapacity),
          bedroomCount: bedroomCount ? Number(bedroomCount) : null,
          bedCount: bedCount ? Number(bedCount) : null,
          bathroomCount: bathroomCount ? Number(bathroomCount) : null,
          basePrice,
          cleaningFee: cleaningFee || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Bir hata oluştu.");
        return;
      }

      setSuccessMessage("Villa başarıyla oluşturuldu.");

      if (data?.data?.id) {
        router.push(`/admin/listings/${data.data.id}`);
        return;
      }

      router.push("/admin/listings");
    } catch {
      setErrorMessage("Villa oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            const value = e.target.value;
            setTitle(value);
            if (!slug) {
              setSlug(slugify(value));
            }
          }}
          placeholder="Villa başlığı"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="Slug"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Şehir"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="İlçe"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={guestCapacity}
          onChange={(e) => setGuestCapacity(e.target.value)}
          placeholder="Kapasite"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={bedroomCount}
          onChange={(e) => setBedroomCount(e.target.value)}
          placeholder="Yatak odası"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={bedCount}
          onChange={(e) => setBedCount(e.target.value)}
          placeholder="Yatak sayısı"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={bathroomCount}
          onChange={(e) => setBathroomCount(e.target.value)}
          placeholder="Banyo sayısı"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          placeholder="Gecelik fiyat"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={cleaningFee}
          onChange={(e) => setCleaningFee(e.target.value)}
          placeholder="Temizlik ücreti"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />
      </div>

      <div className="mt-4 space-y-4">
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Kısa açıklama"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detaylı açıklama"
          rows={6}
          className="w-full resize-none rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />
      </div>

      {successMessage && (
        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={isDisabled}
          onClick={handleSubmit}
          className={`rounded-xl px-6 py-3 text-sm font-medium text-white transition ${
            isDisabled
              ? "cursor-not-allowed bg-[#373889]/60"
              : "bg-[#373889] hover:bg-[#2c2d6e]"
          }`}
        >
          {loading ? "Kaydediliyor..." : "Villa Oluştur"}
        </button>
      </div>
    </div>
  );
}

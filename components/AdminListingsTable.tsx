"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ListingListItem = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  district: string | null;
  basePrice: string;
  isActive: boolean;
  images: {
    id: string;
    url: string;
    isCover: boolean;
  }[];
};

type Props = {
  listings: ListingListItem[];
};

type StatusFilter = "all" | "active" | "passive";

export default function AdminListingsTable({ listings }: Props) {
  const [items, setItems] = useState(listings);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredItems = useMemo(() => {
    return items.filter((listing) => {
      const matchesSearch =
        !search.trim() ||
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        listing.slug.toLowerCase().includes(search.toLowerCase()) ||
        listing.city?.toLowerCase().includes(search.toLowerCase()) ||
        listing.district?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && listing.isActive) ||
        (statusFilter === "passive" && !listing.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handleToggleStatus = async (id: string, nextValue: boolean) => {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem) return;

    try {
      setLoadingId(id);

      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: nextValue,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "Durum güncellenemedi.");
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: nextValue } : item,
        ),
      );
    } catch {
      alert("Durum güncellenemedi.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Bu villayı silmek istediğine emin misin?",
    );

    if (!confirmed) return;

    try {
      setLoadingId(id);

      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "Villa silinemedi.");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Villa silinemedi.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Villa adı, slug, şehir ara..."
            className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Sadece Aktif</option>
            <option value="passive">Sadece Pasif</option>
          </select>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Toplam{" "}
          <span className="font-medium text-[#1F2937]">
            {filteredItems.length}
          </span>{" "}
          villa gösteriliyor.
        </div>
      </div>

      {filteredItems.length > 0 ? (
        filteredItems.map((listing) => {
          const coverImage =
            listing.images.find((img) => img.isCover)?.url ||
            listing.images[0]?.url ||
            "/images/hero.png";

          return (
            <div
              key={listing.id}
              className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <div className="relative h-[180px] w-full">
                  <img
                    src={coverImage}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between p-5">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1F2937]">
                          {listing.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {[listing.district, listing.city]
                            .filter(Boolean)
                            .join(", ") || "Konum girilmedi"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          listing.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {listing.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      Slug:{" "}
                      <span className="text-[#1F2937]">{listing.slug}</span>
                    </div>

                    <div className="mt-2 text-base font-semibold text-[#373889]">
                      ₺{Number(listing.basePrice).toLocaleString("tr-TR")} /
                      gece
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/listings/${listing.id}`}
                      className="rounded-xl bg-[#373889] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2c2d6e]"
                    >
                      Düzenle
                    </Link>

                    <button
                      type="button"
                      disabled={loadingId === listing.id}
                      onClick={() =>
                        handleToggleStatus(listing.id, !listing.isActive)
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        listing.isActive
                          ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      } ${
                        loadingId === listing.id
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                    >
                      {loadingId === listing.id
                        ? "Güncelleniyor..."
                        : listing.isActive
                          ? "Pasife Al"
                          : "Aktif Et"}
                    </button>
                    <button
                      type="button"
                      disabled={loadingId === listing.id}
                      onClick={() => handleDelete(listing.id)}
                      className={`rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 ${
                        loadingId === listing.id
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                    >
                      {loadingId === listing.id ? "İşleniyor..." : "Sil"}
                    </button>
                    <Link
                      href={`/villas//${listing.slug}`}
                      target="_blank"
                      className="rounded-xl bg-[#F5F6FA] px-4 py-2 text-sm font-medium text-[#373889] transition hover:bg-[#E9EDF5]"
                    >
                      Yayında Gör
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Filtreye uygun villa bulunamadı.
        </div>
      )}
    </div>
  );
}

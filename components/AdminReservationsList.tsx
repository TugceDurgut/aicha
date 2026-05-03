"use client";

import { useMemo, useState } from "react";

type ReservationStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED";

type ReservationItem = {
  id: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  fullName: string;
  email: string;
  phone: string | null;
  note: string | null;
  status: ReservationStatus;
  listing: {
    title: string;
    city: string | null;
    district: string | null;
  };
};

type Props = {
  reservations: ReservationItem[];
};

const statusMap: Record<
  ReservationStatus,
  { label: string; className: string }
> = {
  NEW: {
    label: "Yeni",
    className: "bg-blue-50 text-blue-700",
  },
  CONTACTED: {
    label: "İletişime Geçildi",
    className: "bg-yellow-50 text-yellow-700",
  },
  CONFIRMED: {
    label: "Onaylandı",
    className: "bg-green-50 text-green-700",
  },
  CANCELLED: {
    label: "İptal",
    className: "bg-red-50 text-red-700",
  },
};

export default function AdminReservationsList({ reservations }: Props) {
  const [items, setItems] = useState(reservations);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ReservationStatus>(
    "ALL",
  );
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.listing.title.toLowerCase().includes(q) ||
        (item.phone || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [items, search, statusFilter]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    try {
      setLoadingId(id);

      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "Durum güncellenemedi.");
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch {
      alert("Durum güncellenemedi.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim, e-posta, telefon, villa ara..."
            className="w-full rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563] outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | ReservationStatus)
            }
            className="w-full rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563] outline-none"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="NEW">Yeni</option>
            <option value="CONTACTED">İletişime Geçildi</option>
            <option value="CONFIRMED">Onaylandı</option>
            <option value="CANCELLED">İptal</option>
          </select>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Toplam{" "}
          <span className="font-medium text-[#1F2937]">
            {filteredItems.length}
          </span>{" "}
          talep
        </div>
      </div>

      <div className="space-y-5">
        {filteredItems.map((item) => {
          const badge = statusMap[item.status];
          const isFinal =
            item.status === "CONFIRMED" || item.status === "CANCELLED";
          const isLoading = loadingId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                {/* LEFT */}
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-2xl font-semibold text-[#373889]">
                      {item.listing.title}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="text-gray-500">
                    {[item.listing.district, item.listing.city]
                      .filter(Boolean)
                      .join(", ")}
                  </div>

                  <div className="rounded-2xl bg-[#F5F6FA] p-5">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2 text-sm text-[#1F2937]">
                        <div>
                          <b>İsim:</b> {item.fullName}
                        </div>
                        <div>
                          <b>Email:</b> {item.email}
                        </div>
                        <div>
                          <b>Telefon:</b> {item.phone || "-"}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-[#1F2937]">
                        <div>
                          <b>Giriş:</b>{" "}
                          {new Date(item.checkIn).toLocaleDateString("tr-TR")}
                        </div>
                        <div>
                          <b>Çıkış:</b>{" "}
                          {new Date(item.checkOut).toLocaleDateString("tr-TR")}
                        </div>
                        <div>
                          <b>Kişi:</b> {item.guestCount}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-black/5 pt-4">
                      <div className="mb-1 text-xs text-gray-500">Not</div>
                      <div
                        className={
                          item.note
                            ? "text-sm text-[#1F2937]"
                            : "text-sm text-gray-400"
                        }
                      >
                        {item.note || "Not yok"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-stretch justify-center gap-3 lg:items-end">
                  <button
                    type="button"
                    disabled={isLoading || isFinal}
                    onClick={() => updateStatus(item.id, "CONTACTED")}
                    className="w-full rounded-xl bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-700 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50 lg:w-[85%]"
                  >
                    {item.status === "CONTACTED"
                      ? "İletişime Geçildi"
                      : "İletişim"}
                  </button>

                  <button
                    type="button"
                    disabled={isLoading || isFinal}
                    onClick={() => updateStatus(item.id, "CONFIRMED")}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 lg:w-[85%] ${
                      item.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {item.status === "CONFIRMED" ? "Onaylandı" : "Onayla"}
                  </button>

                  <button
                    type="button"
                    disabled={isLoading || isFinal}
                    onClick={() => updateStatus(item.id, "CANCELLED")}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 lg:w-[85%] ${
                      item.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {item.status === "CANCELLED" ? "İptal Edildi" : "İptal Et"}
                  </button>

                  <div className="mt-2 flex w-full flex-col gap-2 lg:w-[85%]">
                    <a
                      href={`mailto:${item.email}`}
                      className="rounded-xl bg-[#EEF0FF] px-4 py-3 text-center text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      Mail
                    </a>

                    {item.phone && (
                      <a
                        href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 transition hover:bg-green-100"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-10 text-center text-sm text-gray-500">
            Filtreye uygun rezervasyon talebi bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}

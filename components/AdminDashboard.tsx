"use client";

import Link from "next/link";

type ReservationStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED";

type ReservationItem = {
  id: string;
  fullName: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  status: ReservationStatus;
  listing: {
    title: string;
  };
};

type Props = {
  stats: {
    total: number;
    NEW: number;
    CONTACTED: number;
    CONFIRMED: number;
    CANCELLED: number;
  };
  reservations: ReservationItem[];
  newMessagesCount: number;
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

export default function AdminDashboard({
  stats,
  reservations,
  newMessagesCount,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Toplam Talep"
          value={stats.total}
          valueClassName="bg-[#EEF0FF] text-[#373889]"
        />

        <StatCard
          title="Yeni Talepler"
          value={stats.NEW}
          valueClassName="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Onaylanan"
          value={stats.CONFIRMED}
          valueClassName="bg-green-50 text-green-700"
        />

        <StatCard
          title="İptal"
          value={stats.CANCELLED}
          valueClassName="bg-red-50 text-red-700"
        />

        <StatCard
          title="Yeni Mesajlar"
          value={newMessagesCount}
          valueClassName="bg-yellow-50 text-yellow-700"
        />
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-[#1F2937]">
            Son Rezervasyonlar
          </h2>

          <Link
            href="/admin/reservations"
            className="inline-flex items-center justify-center rounded-xl bg-[#373889] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2c2d6e]"
          >
            Rezervasyonları Gör
          </Link>
        </div>

        {reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map((item) => {
              const badge = statusMap[item.status];

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl bg-[#F9FAFB] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-base font-semibold text-[#373889]">
                      {item.listing.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {item.fullName}
                    </div>
                  </div>

                  <div className="text-sm text-[#1F2937]">
                    {new Date(item.checkIn).toLocaleDateString("tr-TR")} -{" "}
                    {new Date(item.checkOut).toLocaleDateString("tr-TR")}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-[#FAFAFA] px-6 py-10 text-center text-sm text-gray-500">
            Henüz rezervasyon talebi yok.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: number;
  valueClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
      <div className="text-sm text-gray-500">{title}</div>

      <div
        className={`mt-4 inline-flex rounded-2xl px-4 py-2 text-3xl font-semibold ${valueClassName}`}
      >
        {value}
      </div>
    </div>
  );
}

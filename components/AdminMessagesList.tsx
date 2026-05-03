"use client";

import { useMemo, useState } from "react";

type MessageStatus = "NEW" | "READ" | "REPLIED";

type MessageItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

type Props = {
  messages: MessageItem[];
};

const statusMap: Record<MessageStatus, { label: string; className: string }> = {
  NEW: {
    label: "Yeni",
    className: "bg-blue-50 text-blue-700",
  },
  READ: {
    label: "Okundu",
    className: "bg-yellow-50 text-yellow-700",
  },
  REPLIED: {
    label: "Yanıtlandı",
    className: "bg-green-50 text-green-700",
  },
};

export default function AdminMessagesList({ messages }: Props) {
  const [items, setItems] = useState(messages);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | MessageStatus>(
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
        (item.phone || "").toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [items, search, statusFilter]);

  const updateStatus = async (id: string, status: MessageStatus) => {
    try {
      setLoadingId(id);

      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "Mesaj durumu güncellenemedi.");
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch {
      alert("Mesaj durumu güncellenemedi.");
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
            placeholder="İsim, e-posta, telefon, mesaj ara..."
            className="w-full rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563] outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | MessageStatus)
            }
            className="w-full rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563] outline-none"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="NEW">Yeni</option>
            <option value="READ">Okundu</option>
            <option value="REPLIED">Yanıtlandı</option>
          </select>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Toplam{" "}
          <span className="font-medium text-[#1F2937]">
            {filteredItems.length}
          </span>{" "}
          mesaj
        </div>
      </div>

      <div className="space-y-5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const badge = statusMap[item.status];
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-2xl font-semibold text-[#373889]">
                        {item.fullName}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-[#F5F6FA] p-5">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2 text-sm text-[#1F2937]">
                          <div>
                            <b>Email:</b> {item.email}
                          </div>
                          <div>
                            <b>Telefon:</b> {item.phone || "-"}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-[#1F2937]">
                          <div>
                            <b>Tarih:</b>{" "}
                            {new Date(item.createdAt).toLocaleString("tr-TR")}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-black/5 pt-4">
                        <div className="mb-1 text-xs text-gray-500">Mesaj</div>
                        <div className="text-sm text-[#1F2937]">
                          {item.message}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch justify-center gap-3 lg:items-end">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => updateStatus(item.id, "READ")}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 lg:w-[85%] ${
                        item.status === "READ"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      {item.status === "READ"
                        ? "Okundu"
                        : "Okundu Olarak İşaretle"}
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => updateStatus(item.id, "REPLIED")}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 lg:w-[85%] ${
                        item.status === "REPLIED"
                          ? "bg-green-100 text-green-800"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {item.status === "REPLIED"
                        ? "Yanıtlandı"
                        : "Yanıtlandı Olarak İşaretle"}
                    </button>

                    <div className="mt-2 flex w-full flex-col gap-2 lg:w-[85%]">
                      <a
                        href={`mailto:${item.email}`}
                        className="rounded-xl bg-[#373889] px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-[#2c2d6e]"
                      >
                        Mail Gönder
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
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-10 text-center text-sm text-gray-500">
            Henüz iletişim mesajı yok.
          </div>
        )}
      </div>
    </div>
  );
}

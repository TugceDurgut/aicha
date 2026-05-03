"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import DatePickerInput from "./DatePickerInput";
import GuestSelect from "./GuestSelect";

const parse = (v?: string) => {
  if (!v) return undefined;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
};

const fmtISO = (d?: Date) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`
    : "";

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const formatDisplayDate = (value?: string) => {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${d}.${m}.${y}`;
};

const formatSummary = (startDate: string, endDate: string, guests?: number) => {
  const parts: string[] = [];

  if (startDate && endDate) {
    parts.push(
      `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`,
    );
  } else if (startDate) {
    parts.push(formatDisplayDate(startDate));
  } else {
    parts.push("Tarih seçin");
  }

  if (guests) {
    parts.push(`${guests} kişi`);
  } else {
    parts.push("Kişi sayısı");
  }

  return parts.join(" • ");
};

type ActiveField = null | "start" | "end" | "guests";

export default function VillasFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [guests, setGuests] = useState<number | undefined>(
    searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined,
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  const parsedStartDate = useMemo(() => parse(startDate), [startDate]);
  const endMin = useMemo(
    () => (parsedStartDate ? fmtISO(addDays(parsedStartDate, 1)) : undefined),
    [parsedStartDate],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, mounted]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveField(null);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    };
  }, [activeField]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (startDate) {
      params.set("startDate", startDate);
    } else {
      params.delete("startDate");
    }

    if (endDate) {
      params.set("endDate", endDate);
    } else {
      params.delete("endDate");
    }

    if (guests) {
      params.set("guests", String(guests));
    } else {
      params.delete("guests");
    }

    router.push(`${pathname}?${params.toString()}`);
    setMobileOpen(false);
    setActiveField(null);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setGuests(undefined);
    setActiveField(null);
  };

  const handleClearAndClose = () => {
    setStartDate("");
    setEndDate("");
    setGuests(undefined);
    router.push(pathname);
    setMobileOpen(false);
    setActiveField(null);
  };

  const openMobileSheet = () => {
    setMobileOpen(true);
    setActiveField(null);
  };

  const closeMobileSheet = () => {
    setMobileOpen(false);
    setActiveField(null);
  };

  const mobileSheetHeight =
    activeField === "start"
      ? "h-[68vh]"
      : activeField === "end"
        ? "h-[78vh]"
        : activeField === "guests"
          ? "h-[70vh]"
          : "h-[50vh]";
  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={openMobileSheet}
          className="group w-full rounded-[24px] border border-white/20 bg-white/92 px-4 py-4 text-left shadow-[0_14px_40px_rgba(0,0,0,0.16)] backdrop-blur-md transition active:scale-[0.99]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#373889]/65">
                Filtreler
              </div>

              <div className="mt-1 truncate text-sm font-medium text-[#1F2937]">
                {formatSummary(startDate, endDate, guests)}
              </div>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#373889]/8 text-[#373889]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <div className="hidden overflow-visible rounded-2xl bg-white/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:block">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_220px_auto_auto]">
          <DatePickerInput
            value={startDate}
            onChange={(v: string) => {
              setStartDate(v);

              const s = parse(v);
              const e = parse(endDate);

              if (s && e && e <= s) {
                setEndDate("");
              }
            }}
            placeholder="Giriş tarihi"
          />

          <DatePickerInput
            value={endDate}
            onChange={(v: string) => {
              setEndDate(v);
            }}
            placeholder="Çıkış tarihi"
            disabled={!startDate}
            min={endMin}
          />

          <GuestSelect
            value={guests}
            onChange={(v: number | undefined) => {
              setGuests(v);
            }}
            placeholder="Kişi sayısı"
          />

          <button
            type="button"
            onClick={handleClearAndClose}
            className="rounded-xl bg-white/95 px-4 py-3 text-sm font-medium text-gray-500 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:bg-[#F5F6FA]"
          >
            Temizle
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-[#D62AA0] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2c2d6e]"
          >
            Uygula
          </button>
        </div>
      </div>

      {mounted &&
        mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] md:hidden">
            <button
              type="button"
              aria-label="Filtreleri kapat"
              onClick={closeMobileSheet}
              className="absolute inset-0 bg-black/50"
            />
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute inset-x-0 bottom-0 z-[100000] ${mobileSheetHeight} rounded-t-[28px] bg-[#F8F8FA] shadow-2xl transition-all duration-300 ease-out`}
            >
              <div className="flex h-full flex-col">
                <div
                  className="flex-1 overflow-y-auto px-4 pt-4"
                  onClick={() => setActiveField(null)}
                >
                  <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />

                  <div
                    className="mb-5 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-base font-semibold text-gray-900">
                      Filtrele
                    </h3>

                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-sm font-medium text-[#373889]"
                    >
                      Temizle
                    </button>
                  </div>

                  <div className="space-y-4 pb-6">
                    <div className="mb-1.5 text-xs font-medium text-gray-500">
                      Giriş tarihi
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveField((prev) =>
                          prev === "start" ? null : "start",
                        );
                      }}
                    >
                      <DatePickerInput
                        value={startDate}
                        onChange={(v: string) => {
                          setStartDate(v);

                          const s = parse(v);
                          const e = parse(endDate);

                          if (s && e && e <= s) {
                            setEndDate("");
                          }

                          setActiveField(null);
                        }}
                        placeholder="Giriş tarihi"
                      />
                    </div>
                    <div className="mb-1.5 text-xs font-medium text-gray-500">
                      Çıkış tarihi
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveField((prev) =>
                          prev === "end" ? null : "end",
                        );
                      }}
                    >
                      <DatePickerInput
                        value={endDate}
                        onChange={(v: string) => {
                          setEndDate(v);
                          setActiveField(null);
                        }}
                        placeholder="Çıkış tarihi"
                        disabled={!startDate}
                        min={endMin}
                      />
                    </div>
                    <div className="mb-1.5 text-xs font-medium text-gray-500">
                      Kişi sayısı
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveField((prev) =>
                          prev === "guests" ? null : "guests",
                        );
                      }}
                    >
                      <GuestSelect
                        value={guests}
                        onChange={(v: number | undefined) => {
                          setGuests(v);
                          setActiveField(null);
                        }}
                        placeholder="Kişi sayısı"
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="border-t border-black/5 bg-[#F8F8FA] px-4 pb-4 pt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={!startDate || !endDate}
                    className={`w-full rounded-2xl px-4 py-4 text-sm font-medium transition ${
                      !startDate || !endDate
                        ? "cursor-not-allowed bg-[#373889]/40 text-white"
                        : "bg-[#373889] text-white hover:bg-[#2c2d6e]"
                    }`}
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

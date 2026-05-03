"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import GuestSelect from "./GuestSelect";

type Props = {
  listingId: string;
  maxGuests: number;
  disabledDates: Date[];
};

const fmtISO = (d?: Date) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`
    : "";

export default function BookingRequestForm({
  listingId,
  maxGuests,
  disabledDates,
}: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState<number | undefined>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const today = new Date();
  const disabledDateSet = useMemo(
    () => new Set(disabledDates.map((date) => fmtISO(date))),
    [disabledDates],
  );

  const isDisabled =
    !checkIn || !checkOut || !guestCount || !fullName || !email || loading;

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/95 text-sm text-left text-[#4B5563] shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition outline-none focus:ring-1 focus:ring-[#373889]/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]";

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setSelectedRange(undefined);
      setCheckIn("");
      setCheckOut("");
      setErrorMessage("");
      return;
    }

    if (selectedRange?.from && selectedRange?.to && !range.to) {
      setSelectedRange({
        from: range.from,
        to: undefined,
      });
      setCheckIn(fmtISO(range.from));
      setCheckOut("");
      setErrorMessage("");
      return;
    }

    if (range.from && !range.to) {
      setSelectedRange(range);
      setCheckIn(fmtISO(range.from));
      setCheckOut("");
      setErrorMessage("");
      return;
    }

    if (range.from && range.to) {
      let current = new Date(range.from);

      while (current <= range.to) {
        const key = fmtISO(current);

        if (disabledDateSet.has(key)) {
          setErrorMessage(
            "Seçtiğiniz tarih aralığında dolu gün bulunmaktadır.",
          );
          setSelectedRange(undefined);
          setCheckIn("");
          setCheckOut("");
          return;
        }

        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }

      setSelectedRange(range);
      setCheckIn(fmtISO(range.from));
      setCheckOut(fmtISO(range.to));
      setCalendarOpen(false);
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const recaptchaToken = "";
      const company = "";

      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          guestCount,
          name: fullName,
          email,
          phone,
          note,
          startDate: checkIn,
          endDate: checkOut,
          recaptchaToken,
          company,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Bir hata oluştu.");
        return;
      }

      setSuccessMessage("Rezervasyon talebiniz başarıyla gönderildi.");
      setCheckIn("");
      setCheckOut("");
      setSelectedRange(undefined);
      setGuestCount(undefined);
      setFullName("");
      setEmail("");
      setPhone("");
      setNote("");
      setCalendarOpen(false);
    } catch {
      setErrorMessage("Rezervasyon talebi gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
      <div className="text-sm text-gray-500">Rezervasyon Talebi</div>
      <div className="mt-1 text-2xl font-semibold text-[#373889]">
        Tarihinizi seçin
      </div>

      <div className="mt-6 space-y-4">
        <button
          type="button"
          onClick={() => setCalendarOpen((prev) => !prev)}
          className={inputClass}
        >
          <span className={checkIn ? "text-[#4B5563]" : "text-gray-400"}>
            {checkIn && checkOut
              ? `${checkIn} → ${checkOut}`
              : checkIn
                ? `${checkIn} → Çıkış seçin`
                : "Giriş ve çıkış tarihi seçin"}
          </span>
        </button>

        {calendarOpen && (
          <div
            ref={calendarRef}
            className="rounded-2xl bg-white/95 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
          >
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleRangeSelect}
              numberOfMonths={1}
              disabled={[...disabledDates, { before: today }]}
              showOutsideDays
              className="rdp-aicha"
              modifiersClassNames={{
                selected: "bg-[#373889] text-white rounded-md",
                range_start: "bg-[#373889] text-white rounded-md",
                range_end: "bg-[#373889] text-white rounded-md",
                range_middle: "bg-[#EEF0FF] text-[#373889]",
                disabled:
                  "text-gray-400 line-through opacity-40 cursor-not-allowed",
                today: "font-bold text-[#373889]",
              }}
            />

            {(checkIn || checkOut) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRange(undefined);
                  setCheckIn("");
                  setCheckOut("");
                  setErrorMessage("");
                }}
                className="text-sm text-[#373889] underline mt-5"
              >
                Tarihi temizle
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#F5F6FA] px-4 py-3 text-sm">
            <div className="text-gray-400">Giriş</div>
            <div className="mt-1 font-medium text-[#1F2937]">
              {checkIn || "-"}
            </div>
          </div>

          <div className="rounded-xl bg-[#F5F6FA] px-4 py-3 text-sm">
            <div className="text-gray-400">Çıkış</div>
            <div className="mt-1 font-medium text-[#1F2937]">
              {checkOut || "-"}
            </div>
          </div>
        </div>

        <GuestSelect
          value={guestCount}
          onChange={setGuestCount}
          max={maxGuests}
          placeholder="Kişi sayısı"
        />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ad Soyad"
          className={inputClass}
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          className={inputClass}
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon"
          className={inputClass}
        />

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notunuz"
          rows={4}
          className={`${inputClass} resize-none`}
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
          type="button"
          disabled={isDisabled}
          onClick={handleSubmit}
          className={`w-full rounded-xl px-5 py-3 font-medium text-white transition ${
            isDisabled
              ? "cursor-not-allowed bg-[#D62AA0]/70"
              : "bg-[#D62AA0] hover:bg-[#A61C78]"
          }`}
        >
          {loading ? "Gönderiliyor..." : "Rezervasyon Talebi Gönder"}
        </button>
      </div>
    </div>
  );
}

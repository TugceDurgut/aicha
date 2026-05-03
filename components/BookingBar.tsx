"use client";

import React, { useMemo, useState } from "react";
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
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : "";

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export default function BookingBar() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [guests, setGuests] = useState<number | undefined>();

  const startDate = useMemo(() => parse(start), [start]);
  const endMin = useMemo(
    () => (startDate ? fmtISO(addDays(startDate, 1)) : undefined),
    [startDate],
  );

  const isDisabled = !start || !end;

  return (
    <div className="flex w-full flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[180px]">
        <DatePickerInput
          value={start}
          onChange={(v) => {
            setStart(v);
            const s = parse(v);
            const e = parse(end);
            if (s && e && e <= s) setEnd("");
          }}
          placeholder="Giriş tarihi"
        />
      </div>

      <div className="flex-1 min-w-[180px]">
        <DatePickerInput
          value={end}
          onChange={setEnd}
          placeholder="Çıkış tarihi"
          disabled={!start}
          min={endMin}
        />
      </div>

      <div className="flex-1 min-w-[160px]">
        <GuestSelect value={guests} onChange={setGuests} />
      </div>

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => {
          console.log({ start, end, guests });
        }}
        className={`
          px-6 py-3 rounded-xl text-sm font-medium transition
          ${
            isDisabled
              ? "bg-[#D62AA0] text-white cursor-not-allowed"
              : "bg-[#D62AA0] text-white shadow-md hover:bg-[#A61C78]"
          }
        `}
      >
        Villaları Gör
      </button>
    </div>
  );
}

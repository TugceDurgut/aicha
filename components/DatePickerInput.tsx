"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  placeholder?: string;
  disabled?: boolean;
};

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

const fmtTR = (d?: Date) =>
  d
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(d)
    : "";

export default function DatePickerInput({
  value,
  onChange,
  min,
  placeholder = "Tarih seç",
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => parse(value), [value]);
  const minDate = useMemo(() => parse(min), [min]);

  useEffect(() => {
    const md = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const kd = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", md);
    document.addEventListener("keydown", kd);
    return () => {
      document.removeEventListener("mousedown", md);
      document.removeEventListener("keydown", kd);
    };
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const display = selected ? fmtTR(selected) : "";

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`
          w-full text-left px-4 py-3 rounded-xl bg-white/95 text-sm
          shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition
          focus:outline-none focus:ring-1 focus:ring-[#373889]/30
          hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
          ${disabled ? "opacity-50 cursor-not-allowed hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]" : ""}
        `}
      >
        <span
          className={`
    ${display ? "text-[#4B5563] hover:text-[#374151]" : "text-gray-400"}
    transition-colors
  `}
        >
          {display || placeholder}
        </span>
      </button>

      {open && (
        <div
          className="
      absolute left-0 top-full mt-2 z-[999]
      w-[min(320px,calc(100vw-32px))]
      max-w-[calc(100vw-32px)]
      rounded-2xl bg-white p-3
      border border-black/5
      shadow-[0_16px_48px_rgba(0,0,0,0.18)]
      md:w-[320px]
    "
        >
          <DayPicker
            mode="single"
            selected={selected}
            onDayClick={(day) => {
              onChange?.(fmtISO(day));
              setOpen(false);
            }}
            disabled={{
              before: minDate ? minDate : today,
            }}
            weekStartsOn={1}
            showOutsideDays
            style={
              {
                "--rdp-accent-color": "#373889",
                "--rdp-accent-background-color": "rgba(55,56,137,0.12)",
              } as React.CSSProperties
            }
            classNames={{
              caption: "flex items-center justify-between px-2",
              caption_label: "text-sm font-semibold",
              nav_button: "h-8 w-8 rounded-lg hover:bg-gray-100",
              head_cell: "w-10 text-[11px] uppercase text-gray-400",
              row: "flex w-full mt-1",
              cell: "w-10 h-10 flex items-center justify-center",
              day: "h-10 w-10 rounded-full hover:bg-[#373889]/10 text-sm transition",
              day_today: "rounded-full",
              day_selected: "rounded-full !text-[#373889] font-medium",
              day_outside: "text-gray-300",
              day_disabled: "text-gray-300 opacity-50",
            }}
          />
        </div>
      )}
    </div>
  );
}

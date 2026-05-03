"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
};

export default function GuestSelect({
  value,
  onChange,
  min = 1,
  max = 4,
  placeholder = "Kişi sayısı",
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

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

  const display = value ? `${value} Kişi` : "";

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
            absolute left-0 right-0 mt-2 z-50
            rounded-2xl bg-white p-2
            border border-black/5
            shadow-[0_16px_48px_rgba(0,0,0,0.18)]
          "
        >
          <div className="max-h-60 overflow-auto">
            {options.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  onChange?.(v);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 rounded-xl text-sm transition
         ${value === v ? "bg-[#373889] text-[#DCE1DB]" : "hover:bg-gray-100 text-[#2F3440]"}
                `}
              >
                {v} Kişi
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ImageItem = {
  id: string;
  url: string;
  alt?: string | null;
};

type Props = {
  title: string;
  images: ImageItem[];
};

export default function ListingGallery({ title, images }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goPrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, images.length]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;

    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!images.length) return null;

  const cover = images[0];
  const sideImages = images.slice(1, 5);

  return (
    <>
      <div className="md:hidden">
        <div className="overflow-hidden rounded-[28px]">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedIndex(0);
                setOpen(true);
              }}
              className="relative col-span-2 h-[260px] w-full overflow-hidden rounded-t-[28px]"
            >
              <Image
                src={cover.url}
                alt={cover.alt || title}
                fill
                className="object-cover"
                sizes="100vw"
              />

              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />

              <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#1F2937] shadow-md backdrop-blur-sm">
                {images.length} Fotoğraf
              </div>
            </button>

            {images.slice(1, 3).map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => {
                  setSelectedIndex(index + 1);
                  setOpen(true);
                }}
                className={`relative h-[100px] w-full overflow-hidden ${
                  index === 0 ? "rounded-bl-[28px]" : ""
                } ${index === 1 ? "rounded-br-[28px]" : ""}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setSelectedIndex(0);
              setOpen(true);
            }}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2937] transition hover:bg-[#F5F6FA]"
          >
            Tüm fotoğrafları göster
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="overflow-hidden rounded-3xl">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr]">
            <button
              type="button"
              onClick={() => {
                setSelectedIndex(0);
                setOpen(true);
              }}
              className="relative h-[420px] w-full overflow-hidden rounded-3xl md:rounded-r-none"
            >
              <Image
                src={cover.url}
                alt={cover.alt || title}
                fill
                className="object-cover transition duration-500 hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </button>

            <div className="hidden gap-2 md:grid md:grid-cols-2">
              {sideImages.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index + 1);
                    setOpen(true);
                  }}
                  className="relative h-[206px] w-full overflow-hidden second:rounded-tr-3xl last:rounded-br-3xl"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || title}
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                    sizes="(max-width: 1280px) 33vw, 25vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSelectedIndex(0);
              setOpen(true);
            }}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2937] transition hover:bg-[#F5F6FA]"
          >
            Tüm fotoğrafları göster
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-8">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="flex items-center justify-between pb-4">
              <div className="text-lg font-medium text-white">{title}</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
              >
                Kapat
              </button>
            </div>

            <div
              className="relative flex-1 overflow-hidden rounded-3xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt || title}
                fill
                className="object-contain"
                sizes="100vw"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white transition hover:bg-white/20"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white transition hover:bg-white/20"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="text-sm text-white/70">
                {selectedIndex + 1} / {images.length}
              </div>

              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      index === selectedIndex
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 overflow-x-auto md:grid-cols-6">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-20 overflow-hidden rounded-2xl border-2 ${
                    index === selectedIndex
                      ? "border-white"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || title}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

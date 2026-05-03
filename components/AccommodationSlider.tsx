"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import ListingCard from "./ListingCard";

type Item = {
  id: string;
  slug: string;
  title: string;
  location: string;
  priceFrom?: number;
  image: string;
  tag?: string;
  guestCapacity: number;
  bedroomCount: number | null;
};

type Props = {
  items: Item[];
};

export default function AccommodationSlider({ items }: Props) {
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: items.length > 1,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const dots = useMemo(() => scrollSnaps.map((_, i) => i), [scrollSnaps]);

  const handleOpen = (slug: string) => {
    router.push(`/villas/${slug}`);
  };

  return (
    <div className="w-full">
      {/* MOBILE SLIDER */}
      <div className="md:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex">
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => handleOpen(it.slug)}
                className="flex-[0_0_100%] pl-4 text-left sm:flex-[0_0_60%]"
              >
                <ListingCard key={it.id} item={it} />
              </button>
            ))}
          </div>
        </div>

        {dots.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {dots.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === selectedIndex
                    ? "bg-[#373889]"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden grid-cols-3 gap-6 md:grid">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => handleOpen(it.slug)}
            className="text-left"
          >
            <ListingCard key={it.id} item={it} />
          </button>
        ))}
      </div>
    </div>
  );
}

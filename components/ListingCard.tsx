import Image from "next/image";

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
  item: Item;
};

export default function ListingCard({ item }: Props) {
  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 85vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

        <div className="absolute left-4 bottom-4 flex items-center gap-2 text-sm text-white">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#D62AA0]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z"
              />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
          </div>

          <span className="drop-shadow">{item.location}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-[#373889]">
              {item.title}
            </div>
          </div>

          {typeof item.priceFrom === "number" && (
            <div className="shrink-0 text-right">
              <div className="text-sm font-semibold text-[#D62AA0]">
                ₺{item.priceFrom.toLocaleString("tr-TR")} / gece
              </div>
              <div className="flex justify-between gap-3 text-xs mt-2 text-gray-500">
                <span>{item.guestCapacity} Kişi</span>
                <span>{item.bedroomCount} Yatak Odası</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

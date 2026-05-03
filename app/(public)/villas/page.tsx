import ListingCard from "@/components/ListingCard";
import VillasFilterBar from "@/components/VillasFilterBar";
import { getAllListings } from "@/lib/listings";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    guests?: string;
    startDate?: string;
    endDate?: string;
  }>;
};

type Image = {
  id: string;
  createdAt: Date;
  listingId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isCover: boolean;
};
type AllListings = {
  images: Image[];
  id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  title: string;
  district: string | null;
  city: string | null;
  basePrice: { toString: () => string };
  guestCapacity: number;
  bedroomCount: number | null;
  bathroomCount: number | null;
};

type MappedListing = {
  id: string;
  slug: string;
  title: string;
  location: string;
  image: string;
  priceFrom: number;
  guestCapacity: number;
  bedroomCount: number | null;
  bathroomCount: number | null;
};

export default async function VillasPage({ searchParams }: Props) {
  const params = await searchParams;

  const guests = params.guests ? Number(params.guests) : undefined;
  const startDate = params.startDate || undefined;
  const endDate = params.endDate || undefined;

  const listings = await getAllListings({
    guests,
    startDate,
    endDate,
  });

  const mappedListings = listings.map((item: AllListings) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    location: [item.district, item.city].filter(Boolean).join(", "),
    image:
      item.images.find((img) => img.isCover)?.url ||
      item.images[0]?.url ||
      "/images/hero.png",
    priceFrom: Number(item.basePrice),
    guestCapacity: item.guestCapacity,
    bedroomCount: item.bedroomCount,
    bathroomCount: item.bathroomCount,
  }));

  return (
    <main className="min-h-screen bg-white">
      <section className="relative mt-20 md:mt-10 overflow-visible">
        <div
          className="absolute inset-0 bg-center"
          style={{
            backgroundImage: "url('/images/res2.jpeg')",
            backgroundPosition: "center 58%",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-light tracking-wide text-[#D62AA0] md:text-5xl">
              Villalar
            </h1>
            <p className="mt-4 text-md text-white/85">
              Size uygun tarih ve kapasiteye göre villaları keşfedin.
            </p>
          </div>

          <div className="relative z-[30] mt-8 max-w-6xl overflow-visible">
            <VillasFilterBar />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6">
          {mappedListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {mappedListings.map((it: MappedListing) => (
                <Link key={it.id} href={`/villas/${it.slug}`}>
                  <ListingCard item={it} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#F5F6FA] p-10 text-center text-gray-500">
              Bu filtrelere uygun aktif villa bulunamadı.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

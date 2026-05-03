import AccommodationSlider from "@/components/AccommodationSlider";
import BookingBar from "@/components/BookingBar";
import { getAllListings } from "@/lib/listings";
import Link from "next/link";
export default async function HomePage() {
  const listings = await getAllListings();
  const sliderItems = listings.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    location: [item.district, item.city].filter(Boolean).join(", "),
    priceFrom: Number(item.basePrice),
    image:
      item.images.find((img) => img.isCover)?.url ||
      item.images[0]?.url ||
      "/images/hero.png",
    tag: "Popüler",
    guestCapacity: item.guestCapacity,
    bedroomCount: item.bedroomCount,
  }));
  return (
    <>
      <section className="relative bg-[#F8F9FC] h-[95vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero.png')", height: "73%" }}
        >
          <div className="absolute inset-0" />
        </div>
        <div className="relative z-10 flex h-[90%] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-light tracking-wide text-white md:text-6xl">
            YOUR HOME
            <span className="block italic text-[#D62AA0]">away from home</span>
          </h1>
          <p className="mt-4 md:mb-6 text-lg text-white/90 md:text-xl">
            Uzaktaki eviniz
          </p>
          <div className="mt-2 md:mt-9 w-full md:w-auto rounded-2xl bg-white/95 px-6 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl">
            <BookingBar />
          </div>
        </div>
      </section>
      <section className="relative bg-[#F8F9FC] -mt-40 pb-14 md:-mt-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#373889] md:text-3xl">
                Konaklama Yerleri
              </h2>
              <p className="mt-2 text-gray-500">
                Denize yakın, modern ve konforlu seçenekler
              </p>
            </div>
            <Link
              href="/villas"
              className="relative z-20 hidden md:inline-flex px-4 py-2 rounded-xl bg-white shadow-md hover:shadow-lg transition text-sm text-[#373889]"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="mt-4">
            <AccommodationSlider items={sliderItems} />
          </div>
        </div>
      </section>
    </>
  );
}

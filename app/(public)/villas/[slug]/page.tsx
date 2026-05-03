import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import BookingRequestForm from "@/components/BookingRequestForm";
import ListingGallery from "@/components/ListingGallery";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VillaDetailPage({ params }: Props) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: {
      slug,
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      amenities: {
        include: {
          amenity: true,
        },
      },
      availability: {
        where: {
          status: {
            in: ["BOOKED", "BLOCKED"],
          },
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!listing || !listing.isActive) {
    notFound();
  }

  const disabledDates = listing.availability.map((item) => new Date(item.date));

  const coverImage =
    listing.images.find((img) => img.isCover)?.url ||
    listing.images[0]?.url ||
    "/images/hero.png";

  return (
    <main className="bg-white min-h-screen">
      <section className="relative h-[55vh] w-full">
        <Image
          src={coverImage}
          alt={listing.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-white/85 via-white/20 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#373889] shadow-sm backdrop-blur-sm">
              {[listing.district, listing.city].filter(Boolean).join(", ")}
            </div>

            <h1 className="text-4xl font-light text-[#373889] drop-shadow-sm md:text-5xl">
              {listing.title}
            </h1>

            {listing.shortDescription && (
              <p className="mt-3 max-w-2xl text-lg font-medium text-[#373889]">
                {listing.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.4fr_420px] gap-10">
          <div>
            <ListingGallery
              title={listing.title}
              images={listing.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt || listing.title,
              }))}
            />

            {listing.description && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-[#1F2937]">
                  Konaklama Hakkında
                </h2>
                <p className="mt-4 text-gray-600 leading-8">
                  {listing.description}
                </p>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-[#1F2937]">
                Ev Kuralları
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-[#F5F6FA] p-4">
                  <div className="text-sm text-gray-400">Giriş Saati</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.checkInTime || "-"}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F5F6FA] p-4">
                  <div className="text-sm text-gray-400">Çıkış Saati</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.checkOutTime || "-"}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F5F6FA] p-4">
                  <div className="text-sm text-gray-400">Maksimum Misafir</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.guestCapacity} kişi
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F5F6FA] p-4">
                  <div className="text-sm text-gray-400">Sigara</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.allowSmoking
                      ? "İzin veriliyor"
                      : "İzin verilmiyor"}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F5F6FA] p-4">
                  <div className="text-sm text-gray-400">Evcil Hayvan</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.allowPets ? "Kabul ediliyor" : "Kabul edilmiyor"}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F5F6FA] p-4">
                  <div className="text-sm text-gray-400">Etkinlik</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.allowEvents ? "İzin veriliyor" : "İzin verilmiyor"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-[#1F2937]">
                Özellikler
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                {listing.amenities.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-full bg-[#F5F6FA] px-4 py-2 text-sm text-[#1F2937]"
                  >
                    {item.amenity.name}
                  </div>
                ))}
              </div>
            </div>
            {listing.locationMapUrl && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-[#1F2937]">Konum</h2>

                <div className="mt-4 overflow-hidden rounded-2xl bg-[#F5F6FA]">
                  <iframe
                    src={listing.locationMapUrl}
                    width="100%"
                    height="360"
                    loading="lazy"
                    className="border-0"
                  />
                </div>
              </div>
            )}
            {listing.cancellationPolicy && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-[#1F2937]">
                  İptal Politikası
                </h2>

                <div className="mt-4 rounded-2xl bg-[#F5F6FA] p-5 text-gray-600 leading-7">
                  {listing.cancellationPolicy}
                </div>
              </div>
            )}
          </div>
          <aside className="h-fit sticky top-28 space-y-6">
            <div className="rounded-2xl bg-white border border-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.08)] p-6">
              <div className="text-sm text-gray-500">Gecelik başlangıç</div>
              <div className="mt-1 text-3xl font-semibold text-[#373889]">
                ₺{Number(listing.basePrice).toLocaleString("tr-TR")}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="rounded-xl bg-[#F5F6FA] p-4">
                  <div className="text-gray-400">Kapasite</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.guestCapacity} kişi
                  </div>
                </div>

                <div className="rounded-xl bg-[#F5F6FA] p-4">
                  <div className="text-gray-400">Yatak Odası</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.bedroomCount || "-"}
                  </div>
                </div>

                <div className="rounded-xl bg-[#F5F6FA] p-4">
                  <div className="text-gray-400">Yatak</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.bedCount || "-"}
                  </div>
                </div>

                <div className="rounded-xl bg-[#F5F6FA] p-4">
                  <div className="text-gray-400">Banyo</div>
                  <div className="mt-1 font-medium text-[#1F2937]">
                    {listing.bathroomCount || "-"}
                  </div>
                </div>
              </div>
            </div>
            <BookingRequestForm
              listingId={listing.id}
              maxGuests={listing.guestCapacity}
              disabledDates={disabledDates}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}

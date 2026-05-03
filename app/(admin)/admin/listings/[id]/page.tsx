import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminEditListingForm from "@/components/AdminEditListingForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type ListingSourceItem = {
  id: string;
  sourceType: "AIRBNB";
  icalUrl: string;
  externalListingName: string | null;
  isActive: boolean;
  lastSyncedAt: Date | null;
};

export default async function AdminEditListingPage({ params }: Props) {
  const { id } = await params;

  const [listing, amenities] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
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
        sources: true,
      },
    }),
    prisma.amenity.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!listing) {
    notFound();
  }

  const safeListing = {
    ...listing,
    basePrice: listing.basePrice?.toString(),
    cleaningFee: listing.cleaningFee?.toString() || null,
    locationMapUrl: listing.locationMapUrl || null,
    checkInTime: listing.checkInTime || null,
    checkOutTime: listing.checkOutTime || null,
    allowSmoking: listing.allowSmoking,
    allowPets: listing.allowPets,
    allowEvents: listing.allowEvents,
    cancellationPolicy: listing.cancellationPolicy || null,

    sources: listing.sources.map((source: ListingSourceItem) => ({
      ...source,
      lastSyncedAt: source.lastSyncedAt?.toISOString() || null,
    })),
  };

  return <AdminEditListingForm listing={safeListing} amenities={amenities} />;
}

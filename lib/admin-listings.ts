import { prisma } from "@/lib/prisma";

type ListingListItem = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  district: string | null;
  basePrice: { toString: () => string };
  cleaningFee: { toString: () => string } | null;
  isActive: boolean;
};

export async function getAdminListings() {
  const listings = await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings.map((item: ListingListItem) => ({
    ...item,
    basePrice: Number(item.basePrice),
    cleaningFee: item.cleaningFee ? Number(item.cleaningFee) : null,
  }));
}

export async function getAdminListingById(id: string) {
  const listing = await prisma.listing.findUnique({
    where: {
      id,
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!listing) {
    return null;
  }

  return {
    ...listing,
    basePrice: Number(listing.basePrice),
    cleaningFee: listing.cleaningFee ? Number(listing.cleaningFee) : null,
  };
}

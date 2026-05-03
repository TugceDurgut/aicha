import { prisma } from "@/lib/prisma";

type GetAllListingsParams = {
  guests?: number;
  startDate?: string;
  endDate?: string;
};

export async function getAllListings({
  guests,
  startDate,
  endDate,
}: GetAllListingsParams = {}) {
  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
      ...(guests ? { guestCapacity: { gte: guests } } : {}),
      ...(startDate && endDate
        ? {
            availability: {
              none: {
                status: {
                  in: ["BOOKED", "BLOCKED"],
                },
                date: {
                  gte: new Date(startDate),
                  lt: new Date(endDate),
                },
              },
            },
          }
        : {}),
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings;
}

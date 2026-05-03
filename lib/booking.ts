import { prisma } from "@/lib/prisma";

export async function getBookingRequests() {
  return prisma.bookingRequest.findMany({
    include: {
      listing: {
        select: {
          title: true,
          city: true,
          district: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

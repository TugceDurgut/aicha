import AdminReservationsList from "@/components/AdminReservationsList";
import { prisma } from "@/lib/prisma";

export default async function AdminReservationsPage() {
  const reservations = await prisma.bookingRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          city: true,
          district: true,
        },
      },
    },
  });

  const safeReservations = reservations.map((item) => ({
    ...item,
    checkIn: item.checkIn.toISOString(),
    checkOut: item.checkOut.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return <AdminReservationsList reservations={safeReservations} />;
}

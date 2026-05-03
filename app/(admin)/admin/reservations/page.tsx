import AdminReservationsList from "@/components/AdminReservationsList";
import { prisma } from "@/lib/prisma";

type ReservationStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED";

type ReservationItem = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  fullName: string;
  email: string;
  phone: string | null;
  note: string | null;
  status: ReservationStatus;
  listing: {
    title: string;
    city: string | null;
    district: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
};

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

  const safeReservations = reservations.map((item: ReservationItem) => ({
    ...item,
    checkIn: item.checkIn.toISOString(),
    checkOut: item.checkOut.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return <AdminReservationsList reservations={safeReservations} />;
}

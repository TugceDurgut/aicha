import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/AdminDashboard";

type ReservationStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED";

type ReservationItem = {
  id: string;
  fullName: string;
  checkIn: Date;
  checkOut: Date;
  createdAt: Date;
  status: ReservationStatus;
  listing: {
    title: string;
  };
};

export default async function AdminPage() {
  const [reservations, groupedStats, newMessagesCount] = await Promise.all([
    prisma.bookingRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        listing: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.bookingRequest.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.contactMessage.count({
      where: {
        status: "NEW",
      },
    }),
  ]);

  const stats = {
    total: 0,
    NEW: 0,
    CONTACTED: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
  };

  groupedStats.forEach((item) => {
    const count = item._count.status;
    stats[item.status] = count;
    stats.total += count;
  });

  const safeReservations = reservations.map((item: ReservationItem) => ({
    id: item.id,
    fullName: item.fullName,
    checkIn: item.checkIn.toISOString(),
    checkOut: item.checkOut.toISOString(),
    createdAt: item.createdAt.toISOString(),
    status: item.status,
    listing: {
      title: item.listing.title,
    },
  }));

  return (
    <AdminDashboard
      stats={stats}
      reservations={safeReservations}
      newMessagesCount={newMessagesCount}
    />
  );
}

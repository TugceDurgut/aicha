import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ALLOWED_STATUSES = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "CANCELLED",
] as const;

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { status } = body as {
      status?: (typeof ALLOWED_STATUSES)[number];
    };

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, message: "Geçersiz durum bilgisi." },
        { status: 400 },
      );
    }

    const reservation = await prisma.bookingRequest.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { ok: false, message: "Rezervasyon bulunamadı." },
        { status: 404 },
      );
    }

    const updated = await prisma.bookingRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "CONFIRMED") {
      const dates: Date[] = [];

      let current = new Date(reservation.checkIn);

      while (current < reservation.checkOut) {
        dates.push(new Date(current));
        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }

      await prisma.listingAvailability.createMany({
        data: dates.map((date) => ({
          listingId: reservation.listingId,
          date,
          status: "BOOKED",
          source: "MANUAL",
        })),
        skipDuplicates: true,
      });
    }

    if (status === "CANCELLED") {
      await prisma.listingAvailability.deleteMany({
        where: {
          listingId: reservation.listingId,
          source: "MANUAL",
          date: {
            gte: reservation.checkIn,
            lt: reservation.checkOut,
          },
        },
      });
    }

    return NextResponse.json({
      ok: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH reservation error:", error);

    return NextResponse.json(
      { ok: false, message: "Durum güncellenemedi." },
      { status: 500 },
    );
  }
}

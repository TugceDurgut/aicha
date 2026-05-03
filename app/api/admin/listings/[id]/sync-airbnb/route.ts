import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDatesBetween, normalizeDate, parseIcsEvents } from "@/lib/ical";
import { Prisma } from "@prisma/client";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_: Request, { params }: Props) {
  try {
    const { id } = await params;

    const source = await prisma.listingSource.findFirst({
      where: {
        listingId: id,
        sourceType: "AIRBNB",
        isActive: true,
      },
    });

    if (!source?.icalUrl) {
      return NextResponse.json(
        { ok: false, message: "Airbnb iCal bağlantısı bulunamadı." },
        { status: 404 },
      );
    }

    const response = await fetch(source.icalUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: "iCal verisi alınamadı." },
        { status: 400 },
      );
    }

    const icsText = await response.text();
    const events = parseIcsEvents(icsText);

    const blockedDates = events.flatMap((event) =>
      getDatesBetween(
        normalizeDate(event.startDate),
        normalizeDate(event.endDate),
      ),
    );

    const uniqueDates = Array.from(
      new Map(
        blockedDates.map((date) => [
          normalizeDate(date).toISOString(),
          normalizeDate(date),
        ]),
      ).values(),
    );
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.listingAvailability.deleteMany({
        where: {
          listingId: id,
          source: "AIRBNB",
        },
      });

      if (uniqueDates.length > 0) {
        await tx.listingAvailability.createMany({
          data: uniqueDates.map((date) => ({
            listingId: id,
            date,
            status: "BOOKED",
            source: "AIRBNB",
          })),
          skipDuplicates: true,
        });
      }

      await tx.listingSource.update({
        where: {
          id: source.id,
        },
        data: {
          lastSyncedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      ok: true,
      data: {
        syncedCount: uniqueDates.length,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/listings/[id]/sync-airbnb error:", error);

    return NextResponse.json(
      { ok: false, message: "Airbnb takvimi senkronlanamadı." },
      { status: 500 },
    );
  }
}

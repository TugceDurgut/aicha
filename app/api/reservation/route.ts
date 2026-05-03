import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      listingId,
      guestCount,
      name,
      email,
      phone,
      note,
      startDate,
      endDate,
    } = body;

    if (
      !listingId ||
      !startDate ||
      !endDate ||
      !guestCount ||
      !name ||
      !email
    ) {
      return NextResponse.json(
        { ok: false, message: "Zorunlu alanlar eksik." },
        { status: 400 },
      );
    }

    const checkInDate = new Date(startDate);
    const checkOutDate = new Date(endDate);

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { ok: false, message: "Çıkış tarihi girişten sonra olmalıdır." },
        { status: 400 },
      );
    }

    const blockedDates = await prisma.listingAvailability.findMany({
      where: {
        listingId,
        status: {
          in: ["BOOKED", "BLOCKED"],
        },
        date: {
          gte: checkInDate,
          lt: checkOutDate,
        },
      },
      select: {
        id: true,
        date: true,
        status: true,
      },
    });

    if (blockedDates.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Seçtiğiniz tarihler dolu.",
        },
        { status: 400 },
      );
    }

    const bookingRequest = await prisma.bookingRequest.create({
      data: {
        listingId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestCount: Number(guestCount),
        fullName: name,
        email,
        phone: phone || null,
        note: note || null,
      },
    });

    return NextResponse.json({
      ok: true,
      data: bookingRequest,
    });
  } catch (error) {
    console.error("POST /api/reservation error:", error);

    return NextResponse.json(
      { ok: false, message: "Rezervasyon talebi gönderilemedi." },
      { status: 500 },
    );
  }
}

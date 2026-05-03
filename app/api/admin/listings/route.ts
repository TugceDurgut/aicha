import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const {
      slug,
      title,
      shortDescription,
      description,
      city,
      district,
      guestCapacity,
      bedroomCount,
      bedCount,
      bathroomCount,
      basePrice,
      cleaningFee,
    } = body;

    if (!slug || !title || !guestCapacity || !basePrice) {
      return NextResponse.json(
        { ok: false, message: "Zorunlu alanlar eksik." },
        { status: 400 },
      );
    }

    const existing = await prisma.listing.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Bu slug zaten kullanılıyor." },
        { status: 400 },
      );
    }

    const listing = await prisma.listing.create({
      data: {
        slug,
        title,
        shortDescription: shortDescription || null,
        description: description || null,
        city: city || null,
        district: district || null,
        guestCapacity: Number(guestCapacity),
        bedroomCount: bedroomCount ? Number(bedroomCount) : null,
        bedCount: bedCount ? Number(bedCount) : null,
        bathroomCount: bathroomCount ? Number(bathroomCount) : null,
        basePrice: String(basePrice),
        cleaningFee: cleaningFee ? String(cleaningFee) : null,
        isActive: false,
      },
    });

    return NextResponse.json({
      ok: true,
      data: listing,
    });
  } catch (error) {
    console.error("POST /api/admin/listings error:", error);

    return NextResponse.json(
      { ok: false, message: "Villa oluşturulamadı." },
      { status: 500 },
    );
  }
}

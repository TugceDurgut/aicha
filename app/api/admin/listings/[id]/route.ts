import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    await requireAdmin();
    const { id } = await params;
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
      isActive,
      amenityIds,
      locationMapUrl,
      checkInTime,
      checkOutTime,
      allowSmoking,
      allowPets,
      allowEvents,
      cancellationPolicy,
    } = body;

    if (slug !== undefined) {
      const existing = await prisma.listing.findFirst({
        where: {
          slug,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      });

      if (existing) {
        return NextResponse.json(
          { ok: false, message: "Bu slug zaten kullanılıyor." },
          { status: 400 },
        );
      }
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...(slug !== undefined ? { slug } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(shortDescription !== undefined
          ? { shortDescription: shortDescription || null }
          : {}),
        ...(description !== undefined
          ? { description: description || null }
          : {}),
        ...(city !== undefined ? { city: city || null } : {}),
        ...(district !== undefined ? { district: district || null } : {}),
        ...(guestCapacity !== undefined
          ? { guestCapacity: Number(guestCapacity) }
          : {}),
        ...(bedroomCount !== undefined
          ? { bedroomCount: bedroomCount ? Number(bedroomCount) : null }
          : {}),
        ...(bedCount !== undefined
          ? { bedCount: bedCount ? Number(bedCount) : null }
          : {}),
        ...(bathroomCount !== undefined
          ? { bathroomCount: bathroomCount ? Number(bathroomCount) : null }
          : {}),
        ...(basePrice !== undefined ? { basePrice: String(basePrice) } : {}),
        ...(cleaningFee !== undefined
          ? { cleaningFee: cleaningFee ? String(cleaningFee) : null }
          : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        ...(Array.isArray(amenityIds)
          ? {
              amenities: {
                deleteMany: {},
                create: amenityIds.map((amenityId: string) => ({
                  amenityId,
                })),
              },
            }
          : {}),
        ...(locationMapUrl !== undefined
          ? { locationMapUrl: locationMapUrl || null }
          : {}),

        ...(checkInTime !== undefined
          ? { checkInTime: checkInTime || null }
          : {}),

        ...(checkOutTime !== undefined
          ? { checkOutTime: checkOutTime || null }
          : {}),

        ...(allowSmoking !== undefined
          ? { allowSmoking: Boolean(allowSmoking) }
          : {}),

        ...(allowPets !== undefined ? { allowPets: Boolean(allowPets) } : {}),

        ...(allowEvents !== undefined
          ? { allowEvents: Boolean(allowEvents) }
          : {}),

        ...(cancellationPolicy !== undefined
          ? { cancellationPolicy: cancellationPolicy || null }
          : {}),
      },
      include: {
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      data: listing,
    });
  } catch (error) {
    console.error("PATCH /api/admin/listings/[id] error:", error);

    return NextResponse.json(
      { ok: false, message: "Villa güncellenemedi." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Props) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.$transaction([
      prisma.listingImage.deleteMany({
        where: { listingId: id },
      }),
      prisma.listingAmenityRel.deleteMany({
        where: { listingId: id },
      }),
      prisma.listingAvailability.deleteMany({
        where: { listingId: id },
      }),
      prisma.listingSource.deleteMany({
        where: { listingId: id },
      }),
      prisma.bookingRequest.deleteMany({
        where: { listingId: id },
      }),
      prisma.listing.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Villa silindi.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/listings/[id] error:", error);

    return NextResponse.json(
      { ok: false, message: "Villa silinemedi." },
      { status: 500 },
    );
  }
}

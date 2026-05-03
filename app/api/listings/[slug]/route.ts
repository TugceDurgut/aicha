import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;

    const listing = await prisma.listing.findUnique({
      where: {
        slug,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        sources: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        {
          ok: false,
          message: "İlan bulunamadı.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: listing,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "İlan detayı alınamadı.",
      },
      { status: 500 },
    );
  }
}

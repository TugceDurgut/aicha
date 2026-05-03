import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        isActive: true,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      data: listings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Listeleme verileri alınamadı.",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const listingCount = await prisma.listing.count();
  const amenityCount = await prisma.amenity.count();

  return NextResponse.json({
    ok: true,
    listingCount,
    amenityCount,
  });
}

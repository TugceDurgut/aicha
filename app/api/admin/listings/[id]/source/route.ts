import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { sourceType, icalUrl } = body as {
      sourceType: "AIRBNB";
      icalUrl: string;
    };

    if (!sourceType || !icalUrl) {
      return NextResponse.json(
        { ok: false, message: "Kaynak tipi ve iCal URL zorunludur." },
        { status: 400 },
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json(
        { ok: false, message: "Villa bulunamadı." },
        { status: 404 },
      );
    }

    const source = await prisma.listingSource.upsert({
      where: {
        listingId_sourceType: {
          listingId: id,
          sourceType,
        },
      },
      update: {
        icalUrl,
        isActive: true,
      },
      create: {
        listingId: id,
        sourceType,
        icalUrl,
        isActive: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: source,
    });
  } catch (error) {
    console.error("POST /api/admin/listings/[id]/source error:", error);

    return NextResponse.json(
      { ok: false, message: "iCal kaynağı kaydedilemedi." },
      { status: 500 },
    );
  }
}

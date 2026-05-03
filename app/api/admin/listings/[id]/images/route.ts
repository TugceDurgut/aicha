import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { url, isCover } = body;

    if (!url) {
      return NextResponse.json(
        { ok: false, message: "URL gerekli" },
        { status: 400 },
      );
    }

    if (isCover) {
      await prisma.listingImage.updateMany({
        where: { listingId: id },
        data: { isCover: false },
      });
    }

    const image = await prisma.listingImage.create({
      data: {
        url,
        isCover: Boolean(isCover),
        listingId: id,
      },
    });

    return NextResponse.json({ ok: true, data: image });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "Image eklenemedi" },
      { status: 500 },
    );
  }
}

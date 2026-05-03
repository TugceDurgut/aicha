import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

type Image = {
  id: string;
  createdAt: Date;
  listingId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isCover: boolean;
};

export async function PATCH(_: Request, { params }: Params) {
  try {
    const { id, imageId } = await params;

    await prisma.listingImage.updateMany({
      where: {
        listingId: id,
      },
      data: {
        isCover: false,
      },
    });

    const image = await prisma.listingImage.update({
      where: {
        id: imageId,
      },
      data: {
        isCover: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: image,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/listings/[id]/images/[imageId] error:",
      error,
    );

    return NextResponse.json(
      { ok: false, message: "Kapak görseli güncellenemedi." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id, imageId } = await params;

    const image = await prisma.listingImage.findUnique({
      where: {
        id: imageId,
      },
    });

    if (!image || image.listingId !== id) {
      return NextResponse.json(
        { ok: false, message: "Görsel bulunamadı." },
        { status: 404 },
      );
    }

    await prisma.listingImage.delete({
      where: {
        id: imageId,
      },
    });

    const remainingImages = await prisma.listingImage.findMany({
      where: {
        listingId: id,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    const hasCover = remainingImages.some((img: Image) => img.isCover);

    if (!hasCover && remainingImages.length > 0) {
      await prisma.listingImage.update({
        where: {
          id: remainingImages[0].id,
        },
        data: {
          isCover: true,
        },
      });
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/listings/[id]/images/[imageId] error:",
      error,
    );

    return NextResponse.json(
      { ok: false, message: "Görsel silinemedi." },
      { status: 500 },
    );
  }
}

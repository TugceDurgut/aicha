import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ALLOWED_STATUSES = ["NEW", "READ", "REPLIED"] as const;

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();

    const { status } = body as {
      status?: (typeof ALLOWED_STATUSES)[number];
    };

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, message: "Geçersiz durum bilgisi." },
        { status: 400 },
      );
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      ok: true,
      data: message,
    });
  } catch (error) {
    console.error("PATCH /api/admin/messages/[id] error:", error);

    return NextResponse.json(
      { ok: false, message: "Mesaj durumu güncellenemedi." },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { fullName, email, phone, message, company } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { ok: false, message: "Zorunlu alanlar eksik." },
        { status: 400 },
      );
    }

    if (company) {
      return NextResponse.json(
        { ok: false, message: "Geçersiz istek." },
        { status: 400 },
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        message,
      },
    });

    return NextResponse.json({
      ok: true,
      data: contactMessage,
    });
  } catch (error) {
    console.error("POST /api/contact error:", error);

    return NextResponse.json(
      { ok: false, message: "Mesaj gönderilemedi." },
      { status: 500 },
    );
  }
}

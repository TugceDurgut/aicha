import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email ve şifre zorunlu." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Kullanıcı bulunamadı." },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Şifre hatalı." },
        { status: 401 },
      );
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "Bu alana erişim yetkiniz yok." },
        { status: 403 },
      );
    }
    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin_session", user.id, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Giriş yapılamadı." },
      { status: 500 },
    );
  }
}

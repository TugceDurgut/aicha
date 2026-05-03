import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session) throw new Error("UNAUTHORIZED");

  const user = await prisma.user.findUnique({
    where: { id: session },
  });

  if (!user || user.role !== "ADMIN") throw new Error("FORBIDDEN");

  return user;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session) {
    redirect("/admin/login");
  }

  const [user, newMessagesCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }),
    prisma.contactMessage.count({
      where: {
        status: "NEW",
      },
    }),
  ]);

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      user={{
        name: user.name,
        email: user.email,
      }}
      newMessagesCount={newMessagesCount}
    >
      {children}
    </AdminShell>
  );
}

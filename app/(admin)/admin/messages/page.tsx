import AdminMessagesList from "@/components/AdminMessagesList";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const safeMessages = messages.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return <AdminMessagesList messages={safeMessages} />;
}

import AdminMessagesList from "@/components/AdminMessagesList";
import { prisma } from "@/lib/prisma";

type MessageStatus = "NEW" | "READ" | "REPLIED";

type MessageItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  status: MessageStatus;
  createdAt: Date;
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const safeMessages = messages.map((item: MessageItem) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return <AdminMessagesList messages={safeMessages} />;
}

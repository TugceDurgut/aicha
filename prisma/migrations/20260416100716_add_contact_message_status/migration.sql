-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'READ', 'REPLIED');

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "status" "ContactMessageStatus" NOT NULL DEFAULT 'NEW';

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

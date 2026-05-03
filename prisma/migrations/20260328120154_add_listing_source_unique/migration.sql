/*
  Warnings:

  - A unique constraint covering the columns `[listingId,sourceType]` on the table `ListingSource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListingSource_listingId_sourceType_key" ON "ListingSource"("listingId", "sourceType");

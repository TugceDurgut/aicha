-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "allowEvents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowPets" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowSmoking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cancellationPolicy" TEXT,
ADD COLUMN     "checkInTime" TEXT,
ADD COLUMN     "checkOutTime" TEXT,
ADD COLUMN     "locationMapUrl" TEXT;

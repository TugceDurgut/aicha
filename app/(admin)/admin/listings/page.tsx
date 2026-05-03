import { prisma } from "@/lib/prisma";
import AdminListingsTable from "@/components/AdminListingsTable";
import Link from "next/link";

type ListingListItem = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  district: string | null;
  basePrice: { toString: () => string };
  cleaningFee: { toString: () => string } | null;
  isActive: boolean;
  images: {
    id: string;
    url: string;
    isCover: boolean;
  }[];
};

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  const safeListings = listings.map((listing: ListingListItem) => ({
    ...listing,
    basePrice: listing.basePrice.toString(),
    cleaningFee: listing.cleaningFee?.toString() || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#373889]">Villalar</h1>
        <Link
          href="/admin/listings/new"
          className="rounded-xl bg-[#373889] flex-end px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2c2d6e]"
        >
          Yeni Villa
        </Link>
      </div>

      <AdminListingsTable listings={safeListings} />
    </div>
  );
}

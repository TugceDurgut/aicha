import AdminListingForm from "@/components/AdminListingForm";

export default function AdminNewListingPage() {
  return (
    <main className="min-h-screen bg-[#F5F6FA] py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1F2937]">
            Yeni Villa Ekle
          </h1>
          <p className="mt-2 text-gray-500">
            Yeni bir konaklama kaydı oluşturun.
          </p>
        </div>

        <div className="mt-8">
          <AdminListingForm />
        </div>
      </div>
    </main>
  );
}

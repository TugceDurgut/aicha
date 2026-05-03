import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-[#F7F8FC] py-40">
      <div className="mx-auto max-w-5xl px-6 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-wide text-[#1F2937] md:text-5xl">
            Aicha Villas ile ayrıcalıklı tatil deneyimi
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Doğayla iç içe, konforlu ve özel villalarda unutulmaz bir tatil
            deneyimi sunuyoruz.
          </p>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            Aicha Villas olarak misafirlerimize sadece bir konaklama değil,
            baştan sona özel bir tatil deneyimi sunmayı hedefliyoruz.
          </p>

          <p>
            Tüm villalarımız özenle seçilmiş, konfor ve estetik detaylarıyla
            hazırlanmıştır. İster dinlenmek, ister keşfetmek isteyin — size en
            uygun ortamı sunuyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Value title="Güven" desc="Şeffaf ve güvenilir hizmet" />
          <Value title="Konfor" desc="Yüksek standartlı villalar" />
          <Value title="Memnuniyet" desc="Misafir odaklı yaklaşım" />
        </div>

        <div className="text-center">
          <Link
            href="/villas"
            className="inline-block rounded-xl bg-[#373889] px-6 py-3 text-white"
          >
            Villaları Keşfet
          </Link>
        </div>
      </div>
    </div>
  );
}

function Value({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <div className="font-medium text-[#373889]">{title}</div>
      <div className="text-sm text-gray-500 mt-2">{desc}</div>
    </div>
  );
}

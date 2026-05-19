import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F7F8FC] py-40">
      <div className="mx-auto max-w-5xl px-6 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-wide text-[#1F2937] md:text-5xl">
            Gizlilik Politikası
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Aicha Villas olarak kişisel verilerinizin gizliliğine önem veriyor,
            bilgilerinizi güvenli ve şeffaf bir şekilde işlemeyi taahhüt
            ediyoruz.
          </p>
          <p className="text-sm text-gray-400">Son Güncelleme: 28 Mart 2026</p>
        </div>

        <div className="rounded-2xl bg-white p-6 md:p-10 shadow-sm space-y-8 text-gray-600 leading-relaxed">
          <Section title="1. Toplanan Bilgiler">
            <p>
              Web sitemizi ziyaret ettiğinizde veya rezervasyon talebi
              oluşturduğunuzda ad soyad, telefon numarası, e-posta adresi,
              rezervasyon bilgileri ve iletişim tercihleriniz gibi kişisel
              bilgiler toplanabilir.
            </p>
          </Section>

          <Section title="2. Bilgilerin Kullanım Amacı">
            <p>
              Toplanan bilgiler; rezervasyon süreçlerini yürütmek, sizinle
              iletişime geçmek, taleplerinizi yanıtlamak, hizmet kalitesini
              artırmak ve yasal yükümlülükleri yerine getirmek amacıyla
              kullanılabilir.
            </p>
          </Section>

          <Section title="3. Çerezler">
            <p>
              Web sitemizde kullanıcı deneyimini iyileştirmek, site
              performansını analiz etmek ve güvenliği sağlamak amacıyla çerezler
              kullanılabilir. Tarayıcı ayarlarınızdan çerezleri devre dışı
              bırakabilirsiniz.
            </p>
          </Section>

          <Section title="4. Bilgilerin Paylaşımı">
            <p>
              Kişisel bilgileriniz üçüncü kişilerle satılmaz veya kiralanmaz.
              Ancak rezervasyon, ödeme, teknik altyapı, yasal zorunluluklar ve
              hizmetin sağlanması için gerekli durumlarda yetkili kişi ve
              kurumlarla paylaşılabilir.
            </p>
          </Section>

          <Section title="5. Veri Güvenliği">
            <p>
              Kişisel verilerinizin güvenliği için gerekli teknik ve idari
              önlemler alınmaktadır. Ancak internet üzerinden yapılan veri
              aktarımlarının tamamen güvenli olduğu garanti edilemez.
            </p>
          </Section>

          <Section title="6. Üçüncü Taraf Hizmetleri">
            <p>
              Web sitemizde Google Maps, analiz araçları, ödeme altyapıları veya
              sosyal medya bağlantıları gibi üçüncü taraf hizmetler yer
              alabilir. Bu hizmetlerin kendi gizlilik politikaları geçerlidir.
            </p>
          </Section>

          <Section title="7. Kullanıcı Hakları">
            <p>
              Kişisel verilerinizle ilgili bilgi talep etme, düzeltme, silme,
              işlenmesine itiraz etme ve ilgili mevzuat kapsamında diğer
              haklarınızı kullanma hakkına sahipsiniz.
            </p>
          </Section>

          <Section title="8. Veri Saklama Süresi">
            <p>
              Kişisel verileriniz, hizmetin sağlanması ve yasal yükümlülüklerin
              yerine getirilmesi için gerekli süre boyunca saklanır.
            </p>
          </Section>

          <Section title="9. Politika Değişiklikleri">
            <p>
              Bu Gizlilik Politikası zaman zaman güncellenebilir. Güncel
              politika web sitemizde yayınlandığı tarihten itibaren geçerli
              olur.
            </p>
          </Section>

          <Section title="10. İletişim">
            <p>
              Gizlilik Politikası hakkında sorularınız için bizimle iletişime
              geçebilirsiniz.
            </p>
            <p className="mt-2">
              <span className="font-medium text-[#1F2937]">Aicha Villas</span>
              <br />
              E-posta: info@aıchainşaat.com
            </p>
          </Section>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block rounded-xl bg-[#373889] px-6 py-3 text-white transition hover:bg-[#2c2d6e]"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-medium text-[#1F2937]">{title}</h2>
      <div className="text-sm md:text-base">{children}</div>
    </section>
  );
}

import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aicha Villas | Tatilin Yeni Adresi",
  description:
    "Lüks villalar, özel havuz ve doğa manzaralı konaklama seçenekleri.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

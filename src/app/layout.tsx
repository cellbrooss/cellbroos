import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CellBroos | Premium Telefon Mağazası",
  description: "En yeni akıllı telefonlar, aksesuarlar ve uzman teknik servis desteğiyle fiziksel mağazamıza bekliyoruz.",
  keywords: ["telefon mağazası", "cellbroos", "iphone 16 pro max", "samsung galaxy s25 ultra"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#1d1d1f]">
        {children}
      </body>
    </html>
  );
}

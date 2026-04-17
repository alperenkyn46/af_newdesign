import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LiveTicker } from "@/components/ui/live-ticker";
import { DailyBonus } from "@/components/ui/daily-bonus";
import { FloatingCTA } from "@/components/ui/floating-cta";
import { WelcomePopup } from "@/components/ui/welcome-popup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SlotBuse - En İyi Bahis Siteleri ve Bonuslar",
  description: "Türkiye'nin en güvenilir bahis siteleri, güncel bonuslar ve özel promosyonlar. Hemen üye ol, puan kazan!",
  keywords: "bahis siteleri, casino, bonus, promosyon, canlı bahis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-surface-subtle text-ink min-h-screen`}>
        <div className="animated-bg" aria-hidden="true" />

        <Providers>
          <div className="hidden md:block relative z-10">
            <LiveTicker />
            <DailyBonus />
          </div>

          <Header />

          <div className="relative z-10 flex flex-col min-h-screen">
            <main className="flex-grow pb-16 sm:pb-0">{children}</main>
            <Footer />
          </div>

          <FloatingCTA />
          <WelcomePopup />
        </Providers>
      </body>
    </html>
  );
}

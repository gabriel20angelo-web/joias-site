import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BarraAnuncio from "@/components/BarraAnuncio";
import BotaoVoltarTopo from "@/components/BotaoVoltarTopo";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SocialProof from "@/components/SocialProof";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "AURA MEL — Pratas com Alma e Luz",
  description: "Joias em prata com alma e luz. Peças exclusivas com acabamento premium para brilhar em todos os momentos.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FFFDF9] text-[#1a1a2e]">
        <Providers>
          <BarraAnuncio />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BotaoVoltarTopo />
          <CookieConsent />
          <WhatsAppFloat />
          <SocialProof />
        </Providers>
      </body>
    </html>
  );
}

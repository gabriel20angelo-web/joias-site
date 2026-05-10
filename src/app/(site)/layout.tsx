import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BarraAnuncio from "@/components/BarraAnuncio";
import BotaoVoltarTopo from "@/components/BotaoVoltarTopo";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SocialProof from "@/components/SocialProof";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BarraAnuncio />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BotaoVoltarTopo />
      <CookieConsent />
      <WhatsAppFloat />
      <SocialProof />
    </>
  );
}

"use client";
import { usePathname } from "next/navigation";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visivel, setVisivel] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    const aceito = localStorage.getItem("cookieConsent");
    if (!aceito) {
      setTimeout(() => setVisivel(true), 2000);
    }
  }, []);

  function aceitar() {
    localStorage.setItem("cookieConsent", "true");
    setVisivel(false);
  }

  if (!visivel || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#1a1a2e] text-white p-4 md:p-0 animate-slideUp">
      <div className="max-w-[1400px] mx-auto md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[14px] text-white/80 text-center md:text-left">
          Utilizamos cookies para melhorar sua experiência de navegação. Ao continuar, você concorda com nossa{" "}
          <a href="/politicas" className="text-[#D4A843] hover:underline">politica de privacidade</a>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={aceitar}
            className="bg-[#D4A843] text-white px-6 py-2 text-[12px] uppercase tracking-[0.1em] font-medium hover:bg-[#C49A30] transition-colors"
          >
            Aceitar
          </button>
          <button
            onClick={aceitar}
            className="border border-white/30 text-white px-6 py-2 text-[12px] uppercase tracking-[0.1em] font-medium hover:bg-white/10 transition-colors"
          >
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}

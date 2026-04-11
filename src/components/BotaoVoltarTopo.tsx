"use client";

import { useState, useEffect } from "react";

export default function BotaoVoltarTopo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisivel(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={voltarAoTopo}
      className={`fixed bottom-24 left-6 z-50 w-10 h-10 bg-[#1a1a2e] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#333] ${
        visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Voltar ao topo"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}

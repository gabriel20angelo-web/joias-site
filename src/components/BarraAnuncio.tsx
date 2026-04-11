"use client";

import { useLoja } from "@/context/LojaContext";

export default function BarraAnuncio() {
  const { avisosBarra, config } = useLoja();
  const ativos = avisosBarra.filter(a => a.ativo);

  if (ativos.length === 0) return null;

  function substituir(texto: string) {
    return texto
      .replace(/\$\{freteGratisMinimo\}/g, config.freteGratisMinimo.toString())
      .replace(/\$\{maxParcelas\}/g, config.maxParcelas.toString());
  }

  const textos = [...ativos, ...ativos];

  return (
    <div className="bg-gradient-to-r from-[#1B3A5C] via-[#243F6B] to-[#1B3A5C] text-white overflow-hidden">
      <div className="animate-slide flex whitespace-nowrap">
        {textos.map((aviso, i) => (
          <span key={`${aviso.id}-${i}`} className="inline-block px-10 py-2.5 text-[10px] tracking-[0.2em] font-medium">
            ✦  {substituir(aviso.texto)}
          </span>
        ))}
      </div>
    </div>
  );
}

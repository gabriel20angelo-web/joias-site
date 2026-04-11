"use client";

import { useState } from "react";

export default function GaleriaProduto({ imagens }: { imagens: string[] }) {
  const [indice, setIndice] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [posicaoZoom, setPosicaoZoom] = useState({ x: 50, y: 50 });
  const total = Math.max(imagens.length, 3);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosicaoZoom({ x, y });
  }

  return (
    <div className="space-y-3">
      {/* Imagem principal */}
      <div
        className="aspect-[3/4] bg-[#FBF8F3] flex items-center justify-center relative overflow-hidden cursor-zoom-in"
        onClick={() => setZoom(!zoom)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(false)}
      >
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 relative"
          style={zoom ? {
            transform: "scale(2)",
            transformOrigin: `${posicaoZoom.x}% ${posicaoZoom.y}%`,
          } : undefined}
        >
          {imagens[indice] && !imagens[indice].includes("/produtos/") ? (
            <img src={imagens[indice]} alt="" className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <span className="text-8xl opacity-30">💎</span>
          )}
        </div>

        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setIndice((i) => (i - 1 + total) % total); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center text-[#1a1a2e] hover:bg-white transition-colors duration-300 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIndice((i) => (i + 1) % total); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center text-[#1a1a2e] hover:bg-white transition-colors duration-300 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Indicador de zoom */}
        <div className="absolute bottom-4 right-4 bg-white/80 px-2.5 py-1 text-[10px] text-[#666] font-light flex items-center gap-1.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
          {zoom ? "Clique para sair" : "Clique para zoom"}
        </div>

        {/* Contador */}
        <div className="absolute bottom-4 left-4 bg-white/80 px-2.5 py-1 text-[10px] text-[#666] font-light">
          {indice + 1} / {total}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndice(i)}
            className={`w-20 h-24 bg-[#FBF8F3] flex items-center justify-center text-2xl transition-all duration-300 ${
              i === indice ? "ring-2 ring-[#D4A843]" : "opacity-50 hover:opacity-100"
            }`}
          >
            💎
          </button>
        ))}
      </div>
    </div>
  );
}

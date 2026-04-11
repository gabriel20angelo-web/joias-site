"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLoja } from "@/context/LojaContext";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function BuscaModal({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  const { produtos } = useLoja();
  const [busca, setBusca] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aberta) {
      setBusca("");
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [aberta]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onFechar]);

  const resultados = busca.trim().length >= 2
    ? produtos.filter((p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao.toLowerCase().includes(busca.toLowerCase())
      )
    : [];

  if (!aberta) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-white w-full max-w-2xl mx-auto mt-0 md:mt-20 shadow-2xl max-h-[80vh] flex flex-col animate-slideDown">
        {/* Campo de busca */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <svg className="w-5 h-5 text-[#999] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar joias..."
            className="flex-1 text-[15px] outline-none placeholder:text-[#ccc]"
          />
          <button onClick={onFechar} className="text-[#999] hover:text-[#1a1a2e] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Resultados */}
        <div className="overflow-y-auto flex-1 p-6">
          {busca.trim().length < 2 ? (
            <div className="text-center py-12">
              <p className="text-[13px] text-[#999] font-light">Digite pelo menos 2 caracteres para buscar</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["Colares", "Brincos", "Anéis", "Pulseiras", "Conjuntos"].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setBusca(sug)}
                    className="px-4 py-1.5 bg-[#FBF8F3] text-[12px] text-[#666] font-light hover:bg-[#eee] transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : resultados.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-3xl opacity-30 block mb-4">🔍</span>
              <p className="text-[14px] text-[#999] font-light">
                Nenhum resultado para &ldquo;{busca}&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-[11px] text-[#999] font-light mb-4">
                {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
              </p>
              {resultados.map((p) => (
                <Link
                  key={p.id}
                  href={`/produto/${p.id}`}
                  onClick={onFechar}
                  className="flex items-center gap-4 p-3 hover:bg-[#FBF8F3] transition-colors duration-200 group"
                >
                  <div className="w-14 h-16 bg-[#FBF8F3] group-hover:bg-[#eee] flex items-center justify-center text-xl shrink-0 transition-colors">
                    💎
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#1a1a2e] font-light truncate group-hover:text-[#D4A843] transition-colors">
                      {p.nome}
                    </p>
                    <p className="text-[11px] text-[#999] font-light">{p.categoria}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {p.precoPromocional ? (
                      <>
                        <p className="text-[11px] text-[#bbb] line-through font-light">{formatarPreco(p.preco)}</p>
                        <p className="text-[13px] text-[#1a1a2e] font-medium">{formatarPreco(p.precoPromocional)}</p>
                      </>
                    ) : (
                      <p className="text-[13px] text-[#1a1a2e] font-medium">{formatarPreco(p.preco)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

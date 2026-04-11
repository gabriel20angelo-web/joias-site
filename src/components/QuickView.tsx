"use client";

import { Produto } from "@/types/produto";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useToast } from "@/context/ToastContext";
import Estrelas from "./Estrelas";
import Link from "next/link";
import { useLoja } from "@/context/LojaContext";
import { useEffect } from "react";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function QuickView({ produto, onFechar }: { produto: Produto; onFechar: () => void }) {
  const { adicionar } = useCarrinho();
  const { mostrar } = useToast();
  const { config } = useLoja();
  const precoFinal = produto.precoPromocional ?? produto.preco;
  const parcelas = Math.min(config.maxParcelas, Math.floor(precoFinal / 20));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onFechar]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-white max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scaleIn">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#999] hover:text-[#1a1a2e] transition-colors bg-white/80"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Imagem */}
          <div className="aspect-square bg-[#FBF8F3] flex items-center justify-center overflow-hidden">
            {produto.imagens?.[0] && !produto.imagens[0].includes("/produtos/") ? (
              <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-full object-cover" />
            ) : (
              <span className="text-7xl opacity-30">💎</span>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#D4A843] mb-2 font-medium">
              {produto.categoria}
            </p>
            <h2 className="text-xl font-medium text-[#1a1a2e] tracking-[0.03em] mb-3">
              {produto.nome}
            </h2>

            {produto.nota && (
              <div className="mb-4">
                <Estrelas nota={produto.nota} total={produto.avaliacoes?.length} />
              </div>
            )}

            <div className="flex items-baseline gap-2 mb-2">
              {produto.precoPromocional ? (
                <>
                  <span className="text-[#999] line-through text-[15px]">{formatarPreco(produto.preco)}</span>
                  <span className="text-[22px] font-semibold text-[#1a1a2e]">{formatarPreco(produto.precoPromocional)}</span>
                </>
              ) : (
                <span className="text-[22px] font-semibold text-[#1a1a2e]">{formatarPreco(produto.preco)}</span>
              )}
            </div>

            {parcelas > 1 && (
              <p className="text-[12px] text-[#999] font-light mb-4">
                ou {parcelas}x de {formatarPreco(precoFinal / parcelas)} sem juros
              </p>
            )}

            <p className="text-[14px] text-[#666] leading-relaxed mb-6 flex-1">
              {produto.descricao}
            </p>

            {/* Cores */}
            {produto.cores && produto.cores.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[11px] text-[#999] font-light">Cores:</span>
                {produto.cores.map((cor, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: cor }}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 mt-auto">
              {produto.estoque > 0 ? (
                <button
                  onClick={() => {
                    adicionar(produto);
                    mostrar(`${produto.nome} adicionado ao carrinho`);
                    onFechar();
                  }}
                  className="w-full bg-[#1B3A5C] text-white py-3 text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[#243F6B] transition-colors duration-300"
                >
                  Adicionar ao carrinho
                </button>
              ) : (
                <span className="text-center text-[13px] text-[#c44] font-light py-3">Esgotado</span>
              )}
              <Link
                href={`/produto/${produto.id}`}
                onClick={onFechar}
                className="text-center text-[12px] text-[#D4A843] hover:text-[#1a1a2e] transition-colors font-light py-2"
              >
                Ver detalhes completos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

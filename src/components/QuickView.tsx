"use client";

import { useState, useEffect } from "react";
import { Produto } from "@/types/produto";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useToast } from "@/context/ToastContext";
import { useLoja } from "@/context/LojaContext";
import Link from "next/link";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const nomesCores: Record<string, string> = {
  "#D4AF37": "Dourado", "#C0C0C0": "Prata", "#E8C4C4": "Rosé", "#1a1a2e": "Preto",
};

export default function QuickView({ produto, onFechar }: { produto: Produto; onFechar: () => void }) {
  const { adicionar } = useCarrinho();
  const { mostrar } = useToast();
  const { config } = useLoja();
  const [imgAtiva, setImgAtiva] = useState(0);
  const [corAtiva, setCorAtiva] = useState(0);
  const [quantidade, setQuantidade] = useState(1);

  const precoFinal = produto.precoPromocional ?? produto.preco;
  const parcelas = Math.min(config.maxParcelas, Math.floor(precoFinal / 20));
  const temImagem = produto.imagens?.[0] && !produto.imagens[0].includes("/produtos/");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onFechar(); }
    window.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
  }, [onFechar]);

  function handleAdicionar() {
    for (let i = 0; i < quantidade; i++) adicionar(produto);
    mostrar(`${quantidade}x ${produto.nome} adicionado ao carrinho`);
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn rounded-lg">
        {/* Fechar */}
        <button onClick={onFechar} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#999] hover:text-[#1a1a2e] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Lado esquerdo - Imagens */}
          <div className="bg-[#FBF8F3] p-4">
            {/* Imagem principal */}
            <div className="aspect-square rounded-lg overflow-hidden mb-3 flex items-center justify-center bg-white">
              {temImagem ? (
                <img src={produto.imagens[imgAtiva] || produto.imagens[0]} alt={produto.nome} className="w-full h-full object-contain" />
              ) : (
                <span className="text-7xl opacity-20">💎</span>
              )}
            </div>
            {/* Thumbnails */}
            {produto.imagens && produto.imagens.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {produto.imagens.map((img, i) => (
                  <button key={i} onClick={() => setImgAtiva(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-colors ${imgAtiva === i ? "border-[#1a1a2e]" : "border-transparent hover:border-[#D4A843]"}`}>
                    {img && !img.includes("/produtos/") ? (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#FBF8F3] flex items-center justify-center text-xl opacity-30">💎</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lado direito - Info */}
          <div className="p-6 sm:p-8 flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#D4A843] mb-1 font-semibold">
              {produto.categoria}
            </p>
            <h2 className="text-xl sm:text-2xl text-[#1a1a2e] mb-2 leading-tight">
              {produto.nome}
            </h2>
            <p className="text-[20px] sm:text-[24px] font-semibold text-[#1a1a2e] mb-1">
              {formatarPreco(precoFinal)}
            </p>
            {produto.precoPromocional && (
              <p className="text-[13px] text-[#999] line-through mb-1">{formatarPreco(produto.preco)}</p>
            )}
            {parcelas > 1 && (
              <p className="text-[12px] text-[#999] mb-4">
                ou {parcelas}x de {formatarPreco(precoFinal / parcelas)} sem juros
              </p>
            )}

            {/* Descrição */}
            <p className="text-[14px] text-[#666] leading-relaxed mb-4">
              {produto.descricao}
            </p>

            {/* Info técnica */}
            {(produto.material || produto.peso) && (
              <div className="text-[13px] text-[#888] mb-4 space-y-0.5">
                <p className="font-medium text-[#666]">Informações técnicas</p>
                {produto.material && <p>Material: {produto.material}</p>}
                {produto.peso && <p>Peso: {produto.peso}</p>}
              </div>
            )}

            <hr className="border-gray-100 mb-4" />

            {/* Cores */}
            {produto.cores && produto.cores.length > 0 && (
              <div className="mb-4">
                <p className="text-[12px] font-semibold text-[#1a1a2e] uppercase tracking-wider mb-2">
                  Cor: {nomesCores[produto.cores[corAtiva]] || ""}
                </p>
                <div className="flex gap-2">
                  {produto.cores.map((cor, i) => (
                    <button key={i} onClick={() => setCorAtiva(i)}
                      className={`px-4 py-2 rounded text-[12px] font-medium border transition-all ${
                        corAtiva === i
                          ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                          : "bg-white text-[#666] border-gray-200 hover:border-[#1a1a2e]"
                      }`}>
                      {nomesCores[cor] || cor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div className="mb-4">
              <p className="text-[12px] font-semibold text-[#1a1a2e] uppercase tracking-wider mb-2">Quantidade</p>
              <div className="flex items-center border border-gray-200 rounded w-fit">
                <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="px-4 py-2.5 text-[#666] hover:text-[#1a1a2e] text-[16px]">−</button>
                <span className="px-5 py-2.5 text-[14px] font-medium min-w-[40px] text-center border-x border-gray-200">{quantidade}</span>
                <button onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))} className="px-4 py-2.5 text-[#666] hover:text-[#1a1a2e] text-[16px]">+</button>
              </div>
            </div>

            {/* Estoque */}
            {produto.estoque > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[13px] text-green-600 font-medium">{produto.estoque} em estoque</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, produto.estoque * 2)}%` }} />
                </div>
              </div>
            )}

            {/* Botão */}
            <div className="mt-auto space-y-2">
              {produto.estoque > 0 ? (
                <button onClick={handleAdicionar}
                  className="w-full bg-[#1B3A5C] text-white py-3.5 text-[13px] uppercase tracking-[0.1em] font-semibold rounded hover:bg-[#243F6B] transition-colors btn-lift">
                  Adicionar ao carrinho
                </button>
              ) : (
                <div className="text-center text-[#c44] py-3 text-[14px]">Esgotado</div>
              )}
              <Link href={`/produto/${produto.id}`} onClick={onFechar}
                className="block text-center text-[13px] text-[#1a1a2e] hover:text-[#D4A843] transition-colors underline underline-offset-4 py-1">
                Ver detalhes completos ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

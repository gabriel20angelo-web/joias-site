"use client";

import Link from "next/link";
import { useState } from "react";
import { Produto } from "@/types/produto";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useFavoritos } from "@/context/FavoritosContext";
import { useToast } from "@/context/ToastContext";
import Estrelas from "./Estrelas";
import QuickView from "./QuickView";
import { useLoja } from "@/context/LojaContext";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CardProduto({ produto }: { produto: Produto }) {
  const { adicionar } = useCarrinho();
  const { toggleFavorito, isFavorito } = useFavoritos();
  const { mostrar } = useToast();
  const { config } = useLoja();
  const [quickView, setQuickView] = useState(false);
  const precoFinal = produto.precoPromocional ?? produto.preco;
  const parcelas = Math.min(config.maxParcelas, Math.floor(precoFinal / 20));
  const desconto = produto.precoPromocional
    ? Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)
    : 0;
  const favoritado = isFavorito(produto.id);

  return (
    <>
      <div className="group">
        <Link href={`/produto/${produto.id}`}>
          <div className="aspect-[3/4] product-placeholder relative overflow-hidden mb-4">
            {produto.imagens?.[0] ? (
              <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-full object-cover img-zoom" />
            ) : (
              <div className="w-full h-full flex items-center justify-center img-zoom">
                <span className="text-5xl opacity-20 drop-shadow-sm">
                  {produto.categoria === "Colares" ? "📿" :
                   produto.categoria === "Brincos" ? "✨" :
                   produto.categoria === "Anéis" ? "💍" :
                   produto.categoria === "Pulseiras" ? "⌚" :
                   produto.categoria === "Conjuntos" ? "🎁" : "💎"}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {produto.precoPromocional && (
                <span className="bg-[#c44] text-white text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 font-bold rounded-sm">
                  -{desconto}%
                </span>
              )}
              {produto.novo && (
                <span className="bg-[#1B3A5C] text-white text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 font-bold rounded-sm">
                  Novo
                </span>
              )}
              {produto.maisVendido && !produto.novo && (
                <span className="bg-gradient-to-r from-[#D4A843] to-[#E8C76B] text-white text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 font-bold rounded-sm">
                  Top
                </span>
              )}
            </div>

            {/* Acoes hover (favorito + quick view) */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorito(produto.id);
                  mostrar(favoritado ? "Removido dos favoritos" : "Adicionado aos favoritos", "info");
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 ${
                  favoritado ? "text-[#c44] opacity-100 scale-100" : "text-[#999] opacity-0 group-hover:opacity-100 hover:text-[#c44]"
                }`}
              >
                <svg className="w-4 h-4" fill={favoritado ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickView(true);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-[#999] opacity-0 group-hover:opacity-100 hover:text-[#1a1a2e] transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {produto.estoque <= 3 && produto.estoque > 0 && (
              <span className="absolute bottom-12 left-3 bg-[#D4A843] text-white text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 font-medium">
                Ultimas peças
              </span>
            )}

            {produto.estoque === 0 && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-[13px] uppercase tracking-[0.12em] text-[#1a1a2e] font-medium">Esgotado</span>
              </div>
            )}

            {/* Botao adicionar ao carrinho no hover */}
            {produto.estoque > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  adicionar(produto);
                  mostrar(`${produto.nome} adicionado ao carrinho`);
                }}
                className="absolute bottom-0 left-0 right-0 bg-[#1B3A5C]/95 backdrop-blur-sm text-white py-3.5 text-[10px] uppercase tracking-[0.15em] font-bold opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300"
              >
                Adicionar ao carrinho
              </button>
            )}
          </div>
        </Link>

        <div className="space-y-1.5">
          {produto.nota && (
            <Estrelas nota={produto.nota} total={produto.avaliacoes?.length} />
          )}

          <Link href={`/produto/${produto.id}`}>
            <h3 className="text-[14px] text-[#1a1a2e] hover:text-[#D4A843] transition-colors duration-300 line-clamp-2 leading-snug">
              {produto.nome}
            </h3>
          </Link>

          {/* Cores */}
          {produto.cores && produto.cores.length > 1 && (
            <div className="flex gap-1">
              {produto.cores.map((cor, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: cor }}
                  title={cor === "#D4AF37" ? "Dourado" : cor === "#C0C0C0" ? "Prata" : "Rose"}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {produto.precoPromocional ? (
              <>
                <span className="text-[#bbb] line-through text-[12px] font-light">
                  {formatarPreco(produto.preco)}
                </span>
                <span className="text-[#1a1a2e] text-[14px] font-medium">
                  {formatarPreco(produto.precoPromocional)}
                </span>
              </>
            ) : (
              <span className="text-[#1a1a2e] text-[14px] font-medium">
                {formatarPreco(produto.preco)}
              </span>
            )}
          </div>

          {parcelas > 1 && (
            <p className="text-[11px] text-[#999] font-light">
              {parcelas}x de {formatarPreco(precoFinal / parcelas)} sem juros
            </p>
          )}
        </div>
      </div>

      {quickView && <QuickView produto={produto} onFechar={() => setQuickView(false)} />}
    </>
  );
}

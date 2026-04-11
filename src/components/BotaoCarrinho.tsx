"use client";

import { useState } from "react";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useToast } from "@/context/ToastContext";
import { Produto } from "@/types/produto";

export default function BotaoCarrinho({ produto }: { produto: Produto }) {
  const { adicionar } = useCarrinho();
  const { mostrar } = useToast();
  const [quantidade, setQuantidade] = useState(1);
  const [adicionando, setAdicionando] = useState(false);

  if (produto.estoque === 0) {
    return (
      <button disabled className="w-full bg-[#ddd] text-[#999] py-3.5 text-[12px] uppercase tracking-[0.12em] font-medium cursor-not-allowed">
        Esgotado
      </button>
    );
  }

  function handleAdicionar() {
    setAdicionando(true);
    for (let i = 0; i < quantidade; i++) {
      adicionar(produto);
    }
    mostrar(`${quantidade}x ${produto.nome} adicionado ao carrinho`);
    setTimeout(() => setAdicionando(false), 600);
  }

  return (
    <div className="flex gap-3">
      {/* Seletor de quantidade */}
      <div className="flex items-center border border-[#ddd] shrink-0">
        <button
          onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
          className="px-3 py-3.5 text-[#666] hover:text-[#1a1a2e] transition-colors text-[15px]"
        >
          -
        </button>
        <span className="px-3 py-3.5 text-[15px] min-w-[40px] text-center border-x border-[#ddd]">
          {quantidade}
        </span>
        <button
          onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
          className="px-3 py-3.5 text-[#666] hover:text-[#1a1a2e] transition-colors text-[15px]"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdicionar}
        disabled={adicionando}
        className={`flex-1 text-white py-3.5 text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 flex items-center justify-center gap-2 btn-lift ${
          adicionando ? "bg-[#243F6B] scale-[0.98]" : "bg-[#1B3A5C] hover:bg-[#243F6B]"
        }`}
      >
        {adicionando ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Adicionado!
          </>
        ) : (
          "Adicionar ao Carrinho"
        )}
      </button>
    </div>
  );
}

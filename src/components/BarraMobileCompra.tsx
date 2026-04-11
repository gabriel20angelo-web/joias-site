"use client";

import { useState, useEffect } from "react";
import { Produto } from "@/types/produto";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useToast } from "@/context/ToastContext";
import { useLoja } from "@/context/LojaContext";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function BarraMobileCompra({ produto }: { produto: Produto }) {
  const { adicionar } = useCarrinho();
  const { mostrar } = useToast();
  const { config } = useLoja();
  const [visivel, setVisivel] = useState(false);

  const precoFinal = produto.precoPromocional ?? produto.preco;

  useEffect(() => {
    function handleScroll() {
      setVisivel(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (produto.estoque === 0) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 z-50 md:hidden transition-transform duration-300 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] ${
        visivel ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[14px] font-medium text-[#1a1a2e]">{formatarPreco(precoFinal)}</p>
          <p className="text-[11px] text-[#999] font-light">ou {config.maxParcelas}x de {formatarPreco(precoFinal / config.maxParcelas)}</p>
        </div>
        <button
          onClick={() => {
            adicionar(produto);
            mostrar(`${produto.nome} adicionado ao carrinho`);
          }}
          className="bg-[#1B3A5C] text-white px-8 py-3 text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[#243F6B] transition-colors"
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

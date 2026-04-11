"use client";

import { Produto } from "@/types/produto";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useToast } from "@/context/ToastContext";
import Estrelas from "./Estrelas";
import Link from "next/link";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CompreJunto({ principal, sugestões }: { principal: Produto; sugestões: Produto[] }) {
  const { adicionar } = useCarrinho();
  const { mostrar } = useToast();

  if (sugestões.length === 0) return null;

  const combo = sugestões[0];
  const precoPrincipal = principal.precoPromocional ?? principal.preco;
  const precoCombo = combo.precoPromocional ?? combo.preco;
  const totalSemDesconto = precoPrincipal + precoCombo;
  const totalComDesconto = totalSemDesconto * 0.9;

  return (
    <div className="bg-[#FBF6EE] p-6 mt-8">
      <h3 className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#1a1a2e] mb-4">
        Compre junto e ganhe 10% off
      </h3>
      <div className="flex items-center gap-4 flex-wrap">
        {/* Produto principal */}
        <div className="flex items-center gap-3 flex-1 min-w-[140px] sm:min-w-[200px]">
          <div className="w-16 h-20 bg-[#eee] flex items-center justify-center text-xl shrink-0">💎</div>
          <div>
            <p className="text-[12px] text-[#1a1a2e] font-light line-clamp-2">{principal.nome}</p>
            <p className="text-[12px] text-[#D4A843] font-medium">{formatarPreco(precoPrincipal)}</p>
          </div>
        </div>

        <span className="text-[20px] text-[#ccc] font-light">+</span>

        {/* Produto sugerido */}
        <Link href={`/produto/${combo.id}`} className="flex items-center gap-3 flex-1 min-w-[140px] sm:min-w-[200px] group">
          <div className="w-16 h-20 bg-[#eee] flex items-center justify-center text-xl shrink-0">💎</div>
          <div>
            <p className="text-[12px] text-[#1a1a2e] font-light line-clamp-2 group-hover:text-[#D4A843] transition-colors">{combo.nome}</p>
            <p className="text-[12px] text-[#D4A843] font-medium">{formatarPreco(precoCombo)}</p>
            {combo.nota && <Estrelas nota={combo.nota} />}
          </div>
        </Link>

        <span className="text-[20px] text-[#ccc] font-light">=</span>

        {/* Total */}
        <div className="text-center min-w-[140px]">
          <p className="text-[11px] text-[#999] line-through font-light">{formatarPreco(totalSemDesconto)}</p>
          <p className="text-[18px] font-medium text-[#1B3A5C]">{formatarPreco(totalComDesconto)}</p>
          <button
            onClick={() => {
              adicionar(principal);
              adicionar(combo);
              mostrar("2 peças adicionadas ao carrinho!");
            }}
            className="mt-2 bg-[#1B3A5C] text-white px-6 py-2 text-[11px] uppercase tracking-[0.1em] font-medium hover:bg-[#243F6B] transition-colors w-full"
          >
            Comprar junto
          </button>
        </div>
      </div>
    </div>
  );
}

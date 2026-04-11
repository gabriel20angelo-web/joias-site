"use client";

import { Avaliacao } from "@/types/produto";
import Estrelas from "./Estrelas";

export default function Avaliacoes({
  avaliacoes,
  nota,
}: {
  avaliacoes: Avaliacao[];
  nota: number;
}) {
  const distribuicao = [5, 4, 3, 2, 1].map((n) => ({
    nota: n,
    qtd: avaliacoes.filter((a) => a.nota === n).length,
    pct: Math.round(
      (avaliacoes.filter((a) => a.nota === n).length / avaliacoes.length) * 100
    ),
  }));

  return (
    <section className="border-t border-gray-100 pt-12 mt-12">
      <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-8">
        Avaliacoes dos Clientes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-12">
        {/* Resumo */}
        <div className="bg-[#FBF8F3] p-6 self-start">
          <div className="text-center mb-4">
            <p className="text-4xl font-light text-[#1a1a2e] mb-1">{nota.toFixed(1)}</p>
            <Estrelas nota={nota} />
            <p className="text-[12px] text-[#999] font-light mt-2">
              {avaliacoes.length} {avaliacoes.length === 1 ? "avaliação" : "avaliacoes"}
            </p>
          </div>
          <div className="space-y-2">
            {distribuicao.map((d) => (
              <div key={d.nota} className="flex items-center gap-2">
                <span className="text-[11px] text-[#999] w-3">{d.nota}</span>
                <svg className="w-3 h-3 text-[#D4A843]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" />
                </svg>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4A843] rounded-full transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#999] w-6 text-right">{d.qtd}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-6">
          {avaliacoes.map((av) => (
            <div key={av.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F0E8D8] flex items-center justify-center text-[12px] font-medium text-[#D4A843]">
                    {av.nome.charAt(0)}
                  </div>
                  <span className="text-[13px] font-medium text-[#1a1a2e]">
                    {av.nome}
                  </span>
                </div>
                <span className="text-[11px] text-[#999] font-light">
                  {new Date(av.data).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="ml-11">
                <Estrelas nota={av.nota} />
                <p className="text-[14px] text-[#666] leading-relaxed mt-2">
                  {av.comentario}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

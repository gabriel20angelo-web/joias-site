"use client";

import { useState, ReactNode } from "react";

interface Aba {
  id: string;
  titulo: string;
  conteudo: ReactNode;
}

export default function AbasProduto({ abas }: { abas: Aba[] }) {
  const [ativa, setAtiva] = useState(abas[0]?.id);

  return (
    <div className="border-t border-gray-100 pt-8 mt-12">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-100 mb-8 overflow-x-auto">
        {abas.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAtiva(aba.id)}
            className={`px-6 py-3 text-[12px] uppercase tracking-[0.12em] font-medium transition-all duration-300 whitespace-nowrap border-b-2 -mb-[1px] ${
              ativa === aba.id
                ? "text-[#1a1a2e] border-[#D4A843]"
                : "text-[#999] border-transparent hover:text-[#1a1a2e]"
            }`}
          >
            {aba.titulo}
          </button>
        ))}
      </div>

      {/* Conteudo */}
      {abas.map((aba) => (
        <div key={aba.id} className={ativa === aba.id ? "animate-fadeIn" : "hidden"}>
          {aba.conteudo}
        </div>
      ))}
    </div>
  );
}

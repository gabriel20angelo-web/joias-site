"use client";
import { usePathname } from "next/navigation";

import { useState, useEffect } from "react";
import { useLoja } from "@/context/LojaContext";

const cidades = ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador", "Brasilia", "Recife", "Fortaleza", "Goiania"];
const nomes = ["Maria", "Ana", "Julia", "Fernanda", "Camila", "Beatriz", "Larissa", "Amanda", "Isabela", "Carolina", "Patricia", "Luciana", "Gabriela", "Natalia", "Raquel"];

export default function SocialProof() {
  const { produtos } = useLoja();
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const [notificacao, setNotificacao] = useState<{ nome: string; cidade: string; produto: string } | null>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (produtos.length === 0) return;

    function mostrar() {
      const produto = produtos[Math.floor(Math.random() * produtos.length)];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const cidade = cidades[Math.floor(Math.random() * cidades.length)];
      setNotificacao({ nome, cidade, produto: produto.nome });
      setVisivel(true);
      setTimeout(() => setVisivel(false), 5000);
    }

    // Primeiro popup apos 15s
    const first = setTimeout(mostrar, 15000);
    // Depois a cada 30-60s
    const interval = setInterval(mostrar, 30000 + Math.random() * 30000);

    return () => { clearTimeout(first); clearInterval(interval); };
  }, [produtos]);

  if (!notificacao || !visivel) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50 animate-slideIn max-w-[320px]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex gap-3">
        <div className="w-10 h-12 bg-[#FBF8F3] rounded flex items-center justify-center text-lg shrink-0">💎</div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-[#1a1a2e]">
            <span className="font-medium">{notificacao.nome}</span> de {notificacao.cidade}
          </p>
          <p className="text-[11px] text-[#999] truncate">comprou <span className="text-[#D4A843]">{notificacao.produto}</span></p>
          <p className="text-[10px] text-[#ccc] mt-0.5">ha poucos minutos</p>
        </div>
        <button onClick={() => setVisivel(false)} className="text-[#ccc] hover:text-[#999] self-start shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

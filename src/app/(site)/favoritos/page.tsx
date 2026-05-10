"use client";

import { useFavoritos } from "@/context/FavoritosContext";
import { useLoja } from "@/context/LojaContext";
import Breadcrumb from "@/components/Breadcrumb";
import CardProduto from "@/components/CardProduto";
import Link from "next/link";

export default function FavoritosPage() {
  const { favoritos } = useFavoritos();
  const { produtos } = useLoja();
  const produtosFavoritos = produtos.filter((p) => favoritos.includes(p.id));

  if (produtosFavoritos.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
        <svg className="w-12 h-12 mx-auto text-[#ddd] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <h1 className="text-2xl font-medium text-[#1a1a2e] tracking-[0.03em] mb-4">
          Nenhum favorito ainda
        </h1>
        <p className="text-[14px] text-[#999] font-light mb-10">
          Explore nosso catálogo e salve suas peças preferidas.
        </p>
        <Link
          href="/catalogo"
          className="inline-block bg-[#1B3A5C] text-white px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#243F6B] transition-colors duration-300"
        >
          Ver Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <Breadcrumb itens={[{ label: "Favoritos" }]} />
        <div className="text-center mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-3 font-medium">
          Seus favoritos
        </p>
        <h1 className="text-3xl md:text-5xl text-[#1a1a2e] tracking-[0.03em]">
          Lista de Desejos
        </h1>
        <p className="text-[13px] text-[#999] font-light mt-3">
          {produtosFavoritos.length} {produtosFavoritos.length === 1 ? "peça salva" : "peças salvas"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {produtosFavoritos.map((produto) => (
          <CardProduto key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}

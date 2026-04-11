"use client";

import { useEffect, useState } from "react";
import { useLoja } from "@/context/LojaContext";
import CardProduto from "./CardProduto";

export default function VistoRecentemente({ excluirId }: { excluirId?: string }) {
  const { produtos } = useLoja();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("vistoRecentemente");
    if (salvo) {
      try { setIds(JSON.parse(salvo)); } catch {}
    }
  }, []);

  const produtosVistos = ids
    .filter((id) => id !== excluirId)
    .map((id) => produtos.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  if (produtosVistos.length === 0) return null;

  return (
    <section className="border-t border-gray-100 pt-12 mt-12 mb-8">
      <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-8">
        Vistos recentemente
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
        {produtosVistos.map((p) => (
          <CardProduto key={p!.id} produto={p!} />
        ))}
      </div>
    </section>
  );
}

export function registrarVisualizacao(id: string) {
  if (typeof window === "undefined") return;
  const salvo = localStorage.getItem("vistoRecentemente");
  let ids: string[] = [];
  if (salvo) {
    try { ids = JSON.parse(salvo); } catch {}
  }
  ids = [id, ...ids.filter((i) => i !== id)].slice(0, 10);
  localStorage.setItem("vistoRecentemente", JSON.stringify(ids));
}

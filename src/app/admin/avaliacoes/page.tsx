"use client";

import { useLoja } from "@/context/LojaContext";
import { useState } from "react";
import Link from "next/link";

export default function AdminAvaliacoes() {
  const { produtos, atualizarProduto } = useLoja();
  const [filtroNota, setFiltroNota] = useState(0);

  const todasAvaliacoes = produtos.flatMap(p =>
    (p.avaliacoes || []).map(a => ({ ...a, produtoId: p.id, produtoNome: p.nome }))
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const filtradas = filtroNota > 0 ? todasAvaliacoes.filter(a => a.nota === filtroNota) : todasAvaliacoes;

  const mediaGeral = todasAvaliacoes.length > 0
    ? (todasAvaliacoes.reduce((acc, a) => acc + a.nota, 0) / todasAvaliacoes.length).toFixed(1)
    : "0";

  function removerAvaliacao(produtoId: string, avaliacaoId: string) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;
    const novasAvaliacoes = (produto.avaliacoes || []).filter(a => a.id !== avaliacaoId);
    const novaNota = novasAvaliacoes.length > 0
      ? parseFloat((novasAvaliacoes.reduce((acc, a) => acc + a.nota, 0) / novasAvaliacoes.length).toFixed(1))
      : 0;
    atualizarProduto(produtoId, { avaliacoes: novasAvaliacoes, nota: novaNota });
  }

  const dist = [5, 4, 3, 2, 1].map(n => ({
    nota: n,
    qtd: todasAvaliacoes.filter(a => a.nota === n).length,
    pct: todasAvaliacoes.length > 0 ? Math.round((todasAvaliacoes.filter(a => a.nota === n).length / todasAvaliacoes.length) * 100) : 0,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Avaliacoes</h1>
      <p className="text-[13px] text-[#999] mb-8">Modere as avaliacoes de todos os produtos</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
          <p className="text-4xl font-bold text-[#D4A843]">{mediaGeral}</p>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(i => <svg key={i} className={`w-3 h-3 ${i <= Math.round(parseFloat(mediaGeral)) ? "text-[#D4A843]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" /></svg>)}
          </div>
          <p className="text-[11px] text-[#999] mt-1">Média geral</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
          <p className="text-4xl font-bold text-[#1a1a2e]">{todasAvaliacoes.length}</p>
          <p className="text-[11px] text-[#999] mt-1">Total avaliacoes</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
          <p className="text-4xl font-bold text-green-600">{todasAvaliacoes.filter(a => a.nota >= 4).length}</p>
          <p className="text-[11px] text-[#999] mt-1">Positivas (4-5)</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
          <p className="text-4xl font-bold text-red-500">{todasAvaliacoes.filter(a => a.nota <= 2).length}</p>
          <p className="text-[11px] text-[#999] mt-1">Negativas (1-2)</p>
        </div>
      </div>

      {/* Distribuição */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
        <h2 className="text-[13px] font-semibold text-[#1a1a2e] mb-3">Distribuição</h2>
        <div className="space-y-2">
          {dist.map(d => (
            <button key={d.nota} onClick={() => setFiltroNota(filtroNota === d.nota ? 0 : d.nota)} className={`w-full flex items-center gap-3 py-1 rounded transition-colors ${filtroNota === d.nota ? "bg-[#FBF8F3]" : "hover:bg-gray-50"}`}>
              <span className="text-[12px] text-[#999] w-4">{d.nota}</span>
              <svg className="w-3 h-3 text-[#D4A843]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" /></svg>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#D4A843] rounded-full" style={{ width: `${d.pct}%` }} /></div>
              <span className="text-[12px] text-[#999] w-8 text-right">{d.qtd}</span>
              <span className="text-[10px] text-[#ccc] w-10 text-right">{d.pct}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtro ativo */}
      {filtroNota > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[12px] text-[#999]">Filtrando por {filtroNota} estrelas</span>
          <button onClick={() => setFiltroNota(0)} className="text-[12px] text-[#D4A843] hover:text-[#1a1a2e]">Limpar</button>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {filtradas.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-wrap gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F0E8D8] flex items-center justify-center text-[12px] font-medium text-[#D4A843] shrink-0">{a.nome.charAt(0)}</div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-medium text-[#1a1a2e]">{a.nome}</span>
                <div className="flex gap-0.5">{Array.from({length:a.nota}).map((_,i)=><svg key={i} className="w-3 h-3 text-[#D4A843]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" /></svg>)}</div>
                <span className="text-[11px] text-[#999]">{new Date(a.data).toLocaleDateString("pt-BR")}</span>
              </div>
              <p className="text-[13px] text-[#666] font-light">{a.comentario}</p>
              <Link href={`/admin/produtos/${a.produtoId}`} className="text-[11px] text-[#D4A843] hover:text-[#1a1a2e] mt-1 inline-block">{a.produtoNome}</Link>
            </div>
            <button onClick={() => removerAvaliacao(a.produtoId, a.id)} className="text-red-400 hover:text-red-600 text-[12px] self-start shrink-0">Remover</button>
          </div>
        ))}
        {filtradas.length === 0 && <p className="text-center text-[#999] py-12 text-[13px]">Nenhuma avaliação encontrada.</p>}
      </div>
    </div>
  );
}

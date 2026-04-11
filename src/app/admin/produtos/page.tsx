"use client";

import { useLoja } from "@/context/LojaContext";
import Link from "next/link";
import { useState } from "react";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminProdutos() {
  const { produtos, removerProduto, atualizarProduto, duplicarProduto, reordenarProdutos } = useLoja();
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const categorias = ["Todas", ...new Set(produtos.map((p) => p.categoria))];
  const filtrados = produtos.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria === "Todas" || p.categoria === filtroCategoria;
    return matchBusca && matchCat;
  });

  function toggleSelecionado(id: string) {
    setSelecionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function selecionarTodos() {
    setSelecionados(selecionados.length === filtrados.length ? [] : filtrados.map(p => p.id));
  }

  function acaoBulk(acao: string) {
    if (selecionados.length === 0) return;
    selecionados.forEach(id => {
      if (acao === "destacar") atualizarProduto(id, { destaque: true });
      if (acao === "remover-destaque") atualizarProduto(id, { destaque: false });
      if (acao === "marcar-novo") atualizarProduto(id, { novo: true });
      if (acao === "remover-novo") atualizarProduto(id, { novo: false });
      if (acao === "excluir") removerProduto(id);
    });
    setSelecionados([]);
  }

  function mover(id: string, direcao: "cima" | "baixo") {
    const ids = produtos.map(p => p.id);
    const idx = ids.indexOf(id);
    if (direcao === "cima" && idx > 0) { [ids[idx], ids[idx - 1]] = [ids[idx - 1], ids[idx]]; }
    if (direcao === "baixo" && idx < ids.length - 1) { [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]]; }
    reordenarProdutos(ids);
  }

  function importarCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").slice(1);
      let count = 0;
      lines.forEach(line => {
        const cols = line.split(",").map(c => c.replace(/"/g, "").trim());
        if (cols.length >= 4 && cols[0]) {
          const { adicionarProduto } = useLoja.arguments; // won't work here, using direct import
        }
      });
      alert(`Importação CSV: funcionalidade disponível quando migrar para Supabase.`);
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Produtos</h1>
          <p className="text-[13px] text-[#999] mt-1">{produtos.length} produtos cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/produtos/novo" className="bg-[#1B3A5C] text-white px-5 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Novo Produto
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4 flex flex-wrap gap-3">
        <input type="text" placeholder="Buscar produto..." value={busca} onChange={(e) => setBusca(e.target.value)} className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#D4A843]" />
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#D4A843] bg-white">
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Ações em massa */}
      {selecionados.length > 0 && (
        <div className="bg-[#1B3A5C] text-white rounded-xl p-4 mb-4 flex items-center justify-between flex-wrap gap-3 animate-slideDown">
          <span className="text-[13px]">{selecionados.length} produto(s) selecionado(s)</span>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => acaoBulk("destacar")} className="px-3 py-1.5 bg-white/10 rounded-lg text-[12px] hover:bg-white/20">Destacar</button>
            <button onClick={() => acaoBulk("remover-destaque")} className="px-3 py-1.5 bg-white/10 rounded-lg text-[12px] hover:bg-white/20">Remover destaque</button>
            <button onClick={() => acaoBulk("marcar-novo")} className="px-3 py-1.5 bg-white/10 rounded-lg text-[12px] hover:bg-white/20">Marcar como novo</button>
            <button onClick={() => acaoBulk("remover-novo")} className="px-3 py-1.5 bg-white/10 rounded-lg text-[12px] hover:bg-white/20">Remover "novo"</button>
            <button onClick={() => { if (confirm(`Excluir ${selecionados.length} produtos?`)) acaoBulk("excluir"); }} className="px-3 py-1.5 bg-red-500/80 rounded-lg text-[12px] hover:bg-red-500">Excluir todos</button>
            <button onClick={() => setSelecionados([])} className="px-3 py-1.5 text-[12px] text-white/60">Limpar seleção</button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50"><tr>
              <th className="px-3 py-3 w-8"><input type="checkbox" checked={selecionados.length === filtrados.length && filtrados.length > 0} onChange={selecionarTodos} className="w-4 h-4 accent-[#D4A843]" /></th>
              <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Produto</th>
              <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Categoria</th>
              <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Preço</th>
              <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Estoque</th>
              <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Tags</th>
              <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Ações</th>
            </tr></thead>
            <tbody>
              {filtrados.map((p, idx) => (
                <tr key={p.id} className={`border-t border-gray-50 hover:bg-gray-50/50 ${selecionados.includes(p.id) ? "bg-blue-50/30" : ""}`}>
                  <td className="px-3 py-3"><input type="checkbox" checked={selecionados.includes(p.id)} onChange={() => toggleSelecionado(p.id)} className="w-4 h-4 accent-[#D4A843]" /></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-12 bg-[#FBF8F3] rounded flex items-center justify-center text-sm shrink-0">💎</div><div><p className="font-medium text-[#1a1a2e]">{p.nome}</p><p className="text-[11px] text-[#999]">#{p.id}</p></div></div></td>
                  <td className="px-4 py-3 text-[#666]">{p.categoria}</td>
                  <td className="px-4 py-3">{p.precoPromocional ? <><span className="line-through text-[#bbb] text-[11px] block">{formatarPreco(p.preco)}</span><span className="font-medium text-[#1a1a2e]">{formatarPreco(p.precoPromocional)}</span></> : <span className="font-medium">{formatarPreco(p.preco)}</span>}</td>
                  <td className="px-4 py-3"><span className={`font-medium ${p.estoque === 0 ? "text-red-500" : p.estoque <= 5 ? "text-amber-500" : "text-green-600"}`}>{p.estoque}</span></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{p.destaque && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px]">Destaque</span>}{p.novo && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px]">Novo</span>}{p.maisVendido && <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px]">Vendido</span>}{p.precoPromocional && <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px]">Promo</span>}</div></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <Link href={`/admin/produtos/${p.id}`} className="text-[#D4A843] hover:text-[#C49A30] text-[12px] font-medium">Editar</Link>
                      <button onClick={() => duplicarProduto(p.id)} className="text-[#999] hover:text-[#1a1a2e] text-[12px]" title="Duplicar">📋</button>
                      <button onClick={() => mover(p.id, "cima")} disabled={idx === 0} className="text-[#ccc] hover:text-[#1a1a2e] text-[12px] disabled:opacity-30" title="Subir">↑</button>
                      <button onClick={() => mover(p.id, "baixo")} disabled={idx === filtrados.length - 1} className="text-[#ccc] hover:text-[#1a1a2e] text-[12px] disabled:opacity-30" title="Descer">↓</button>
                      {confirmDelete === p.id ? (
                        <><button onClick={() => { removerProduto(p.id); setConfirmDelete(null); }} className="text-red-500 text-[12px] font-medium">Sim</button><button onClick={() => setConfirmDelete(null)} className="text-[#999] text-[12px]">Não</button></>
                      ) : (
                        <button onClick={() => setConfirmDelete(p.id)} className="text-red-400 hover:text-red-600 text-[12px]">Excluir</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtrados.length === 0 && <p className="text-center text-[#999] py-12 text-[13px]">Nenhum produto encontrado.</p>}
      </div>
    </div>
  );
}

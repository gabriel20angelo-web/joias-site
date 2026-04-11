"use client";
import { useFinanceiro } from "@/context/FinanceiroContext";
import { useState } from "react";
import Link from "next/link";

function F(v: number) { return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function FinanceiroTransacoes() {
  const { transacoes, removeTransacao } = useFinanceiro();
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const POR_PAGINA = 20;

  const filtradas = transacoes.filter(t => {
    const matchBusca = !busca || t.item.toLowerCase().includes(busca.toLowerCase()) || t.categoria.toLowerCase().includes(busca.toLowerCase()) || t.subcategoria.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === "Todos" || t.tipo === filtroTipo;
    return matchBusca && matchTipo;
  }).sort((a, b) => b.data.localeCompare(a.data));

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA);
  const paginadas = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const totalReceitas = filtradas.filter(t => t.tipo === "Receita").reduce((s, t) => s + t.qtd * t.valorUn, 0);
  const totalDespesas = filtradas.filter(t => t.tipo === "Despesa").reduce((s, t) => s + t.qtd * t.valorUn, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Transações</h1>
          <p className="text-[13px] text-[#999] mt-1">{filtradas.length} transações · Receitas: <span className="text-green-600 font-medium">{F(totalReceitas)}</span> · Despesas: <span className="text-red-500 font-medium">{F(totalDespesas)}</span></p>
        </div>
        <Link href="/admin/financeiro/lancamento" className="bg-[#1B3A5C] text-white px-5 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#243F6B]">+ Novo Lançamento</Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input type="text" placeholder="Buscar..." value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} className="flex-1 min-w-[180px] border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#D4A843]" />
        <div className="flex gap-1">
          {["Todos", "Receita", "Despesa"].map(t => (
            <button key={t} onClick={() => { setFiltroTipo(t); setPagina(1); }} className={`px-3 py-1.5 rounded-lg text-[12px] ${filtroTipo === t ? "bg-[#1B3A5C] text-white" : "bg-gray-100 text-[#666] hover:bg-gray-200"}`}>{t === "Receita" ? "Receitas" : t === "Despesa" ? "Despesas" : t}</button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Data</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Tipo</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Categoria</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Item</th>
              <th className="px-4 py-3 text-center text-[11px] uppercase tracking-wider text-[#999] font-medium">Qtd</th>
              <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-[#999] font-medium">Total</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Método</th>
              <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-[#999] font-medium">Ação</th>
            </tr></thead>
            <tbody>
              {paginadas.map(t => {
                const total = t.qtd * t.valorUn;
                const isR = t.tipo === "Receita";
                return (
                  <tr key={t.id} className={`border-t border-gray-50 hover:bg-gray-50/50 ${isR ? "border-l-2 border-l-green-400" : "border-l-2 border-l-red-400"}`}>
                    <td className="px-4 py-3 text-[#999]">{new Date(t.data).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isR ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.tipo}</span></td>
                    <td className="px-4 py-3 text-[#666]">{t.categoria}{t.subcategoria ? ` → ${t.subcategoria}` : ""}</td>
                    <td className="px-4 py-3 font-medium">{t.item || "—"}</td>
                    <td className="px-4 py-3 text-center">{t.qtd}</td>
                    <td className={`px-4 py-3 text-right font-bold ${isR ? "text-green-600" : "text-red-500"}`}>{isR ? "+" : "-"}{F(total)}</td>
                    <td className="px-4 py-3"><span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded">{t.metodo}</span></td>
                    <td className="px-4 py-3 text-right">
                      {confirmDel === t.id ? (
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => { removeTransacao(t.id); setConfirmDel(null); }} className="text-red-500 text-[12px] font-medium">Sim</button>
                          <button onClick={() => setConfirmDel(null)} className="text-[#999] text-[12px]">Não</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDel(t.id)} className="text-red-400 hover:text-red-600 text-[12px]">Excluir</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtradas.length === 0 && <p className="text-center text-[#999] py-12 text-[13px]">Nenhuma transação encontrada.</p>}

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-50">
            <button onClick={() => setPagina(Math.max(1, pagina - 1))} disabled={pagina === 1} className="px-3 py-1.5 rounded text-[12px] bg-gray-100 disabled:opacity-30">←</button>
            <span className="text-[12px] text-[#999]">{pagina} de {totalPaginas}</span>
            <button onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))} disabled={pagina === totalPaginas} className="px-3 py-1.5 rounded text-[12px] bg-gray-100 disabled:opacity-30">→</button>
          </div>
        )}
      </div>
    </div>
  );
}

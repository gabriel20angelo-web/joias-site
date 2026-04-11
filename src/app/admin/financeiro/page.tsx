"use client";
import { useFinanceiro } from "@/context/FinanceiroContext";
import { useState, useMemo } from "react";
import Link from "next/link";

function F(v: number) { return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function FinanceiroDashboard() {
  const { transacoes, contas, getSaldo, saldoInicial, capitalGiro } = useFinanceiro();
  const [periodo, setPeriodo] = useState<"mes" | "semana" | "trimestre" | "ano" | "tudo">("mes");

  const filtradas = useMemo(() => {
    const now = new Date();
    return transacoes.filter(t => {
      const d = new Date(t.data + "T12:00:00");
      if (periodo === "tudo") return true;
      if (periodo === "semana") return (now.getTime() - d.getTime()) / 864e5 <= 7;
      if (periodo === "mes") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (periodo === "trimestre") return Math.floor(d.getMonth() / 3) === Math.floor(now.getMonth() / 3) && d.getFullYear() === now.getFullYear();
      if (periodo === "ano") return d.getFullYear() === now.getFullYear();
      return true;
    });
  }, [transacoes, periodo]);

  const receitas = filtradas.filter(t => t.tipo === "Receita");
  const despesas = filtradas.filter(t => t.tipo === "Despesa");
  const totalReceitas = receitas.reduce((s, t) => s + t.qtd * t.valorUn, 0);
  const totalDespesas = despesas.reduce((s, t) => s + t.qtd * t.valorUn, 0);
  const fixos = despesas.filter(t => t.natureza === "Fixo").reduce((s, t) => s + t.qtd * t.valorUn, 0);
  const variaveis = despesas.filter(t => t.natureza === "Variável").reduce((s, t) => s + t.qtd * t.valorUn, 0);
  const saldo = getSaldo();
  const margem = totalReceitas > 0 ? ((totalReceitas - totalDespesas) / totalReceitas * 100) : 0;
  const nVendas = receitas.length;
  const ticket = nVendas > 0 ? totalReceitas / nVendas : 0;
  const contasVencidas = contas.filter(c => !c.pago && c.vencimento < new Date().toISOString().split("T")[0]).length;

  // Despesas por categoria
  const despPorCat: Record<string, number> = {};
  despesas.forEach(t => { despPorCat[t.categoria] = (despPorCat[t.categoria] || 0) + t.qtd * t.valorUn; });
  const catsSorted = Object.entries(despPorCat).sort((a, b) => b[1] - a[1]);
  const maxCat = catsSorted[0]?.[1] || 1;

  // Mais vendidos
  const vendPorItem: Record<string, { qtd: number; valor: number }> = {};
  receitas.forEach(t => { const k = t.item || t.subcategoria; if (!vendPorItem[k]) vendPorItem[k] = { qtd: 0, valor: 0 }; vendPorItem[k].qtd += t.qtd; vendPorItem[k].valor += t.qtd * t.valorUn; });
  const topVendidos = Object.entries(vendPorItem).sort((a, b) => b[1].valor - a[1].valor).slice(0, 5);

  // Últimas transações
  const ultimas = [...transacoes].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 8);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Financeiro</h1>
          <p className="text-[13px] text-[#999] mt-1">Visão geral das finanças</p>
        </div>
        <Link href="/admin/financeiro/lancamento" className="bg-[#1B3A5C] text-white px-5 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Novo Lançamento
        </Link>
      </div>

      {/* Período */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(["mes", "semana", "trimestre", "ano", "tudo"] as const).map(p => (
          <button key={p} onClick={() => setPeriodo(p)} className={`px-4 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-colors ${periodo === p ? "bg-[#1B3A5C] text-white" : "bg-white border border-gray-200 text-[#666] hover:border-gray-300"}`}>
            {{ mes: "Mês", semana: "Semana", trimestre: "Trimestre", ano: "Ano", tudo: "Tudo" }[p]}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-[#D4A843]">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Saldo</p>
          <p className={`text-2xl font-bold mt-1 ${saldo >= 0 ? "text-[#D4A843]" : "text-red-500"}`}>{F(saldo)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-green-500">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Receitas</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{F(totalReceitas)}</p>
          <p className="text-[11px] text-[#999]">{nVendas} vendas</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Despesas</p>
          <p className="text-2xl font-bold mt-1 text-red-500">{F(totalDespesas)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-blue-500">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Margem</p>
          <p className={`text-2xl font-bold mt-1 ${margem >= 0 ? "text-blue-600" : "text-red-500"}`}>{margem.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Ticket Médio</p>
          <p className="text-xl font-bold mt-1 text-[#1a1a2e]">{F(ticket)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Custos Fixos</p>
          <p className="text-xl font-bold mt-1 text-purple-600">{F(fixos)}</p>
          <p className="text-[11px] text-[#999]">{totalDespesas > 0 ? ((fixos / totalDespesas * 100) | 0) : 0}% das despesas</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Custos Variáveis</p>
          <p className="text-xl font-bold mt-1 text-orange-500">{F(variaveis)}</p>
          <p className="text-[11px] text-[#999]">{totalDespesas > 0 ? ((variaveis / totalDespesas * 100) | 0) : 0}% das despesas</p>
        </div>
        <div className={`bg-white rounded-xl p-5 border border-gray-100 ${contasVencidas > 0 ? "border-l-4 border-l-red-500" : ""}`}>
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Contas Vencidas</p>
          <p className={`text-xl font-bold mt-1 ${contasVencidas > 0 ? "text-red-500" : "text-green-600"}`}>{contasVencidas}</p>
          {contasVencidas > 0 && <Link href="/admin/financeiro/contas" className="text-[11px] text-red-500">Ver contas →</Link>}
        </div>
      </div>

      {/* Capital de giro */}
      {capitalGiro > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 mb-8">
          <div className="flex justify-between text-[13px] mb-2">
            <span className="font-semibold">Capital de Giro</span>
            <span className={`font-bold ${saldo >= capitalGiro ? "text-green-600" : saldo >= capitalGiro * 0.6 ? "text-orange-500" : "text-red-500"}`}>
              {Math.min(100, (saldo / capitalGiro * 100) | 0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${saldo >= capitalGiro ? "bg-green-500" : saldo >= capitalGiro * 0.6 ? "bg-orange-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(100, Math.max(0, saldo / capitalGiro * 100))}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-[#999] mt-1">
            <span>Saldo: {F(saldo)}</span>
            <span>Meta: {F(capitalGiro)}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Despesas por Categoria */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Despesas por Categoria</h2>
          {catsSorted.length > 0 ? catsSorted.map(([cat, valor]) => (
            <div key={cat} className="mb-3">
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-[#1a1a2e]">{cat}</span>
                <span className="text-[#999]">{F(valor)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${(valor / maxCat * 100)}%` }} />
              </div>
            </div>
          )) : <p className="text-[13px] text-[#999] text-center py-6">Sem despesas no período</p>}
        </div>

        {/* Mais vendidos */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Mais Vendidos</h2>
          {topVendidos.length > 0 ? topVendidos.map(([nome, data], i) => (
            <div key={nome} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <span className="w-6 h-6 rounded-full bg-[#FBF8F3] flex items-center justify-center text-[10px] font-bold text-[#D4A843]">{i + 1}</span>
              <div className="flex-1">
                <p className="text-[13px] text-[#1a1a2e]">{nome}</p>
                <p className="text-[11px] text-[#999]">{data.qtd} un.</p>
              </div>
              <span className="text-[13px] font-bold text-green-600">{F(data.valor)}</span>
            </div>
          )) : <p className="text-[13px] text-[#999] text-center py-6">Sem vendas no período</p>}
        </div>
      </div>

      {/* Últimos lançamentos */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e]">Últimos Lançamentos</h2>
          <Link href="/admin/financeiro/transacoes" className="text-[12px] text-[#D4A843]">Ver todos →</Link>
        </div>
        {ultimas.length > 0 ? ultimas.map(t => {
          const total = t.qtd * t.valorUn;
          const isR = t.tipo === "Receita";
          return (
            <div key={t.id} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0 text-[13px]">
              <div>
                <span className="font-medium">{t.item || t.subcategoria || t.categoria}</span>
                {t.qtd > 1 && <span className="text-[#999]"> ×{t.qtd}</span>}
                <br />
                <span className="text-[11px] text-[#999]">{new Date(t.data).toLocaleDateString("pt-BR")} · {t.categoria}</span>
              </div>
              <span className={`font-bold ${isR ? "text-green-600" : "text-red-500"}`}>{isR ? "+" : "-"}{F(total)}</span>
            </div>
          );
        }) : <p className="text-[13px] text-[#999] text-center py-6">Nenhum lançamento ainda</p>}
      </div>
    </div>
  );
}

"use client";
import { useFinanceiro } from "@/context/FinanceiroContext";
import { useState } from "react";

function F(v: number) { return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function ContasPagar() {
  const { contas, addConta, updateConta, removeConta, categorias } = useFinanceiro();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtro, setFiltro] = useState<"todas" | "pendentes" | "pagas" | "vencidas">("pendentes");
  const [form, setForm] = useState({ descricao: "", valor: "", vencimento: "", categoria: "", recorrente: false });

  const hoje = new Date().toISOString().split("T")[0];
  const filtradas = contas.filter(c => {
    if (filtro === "pendentes") return !c.pago;
    if (filtro === "pagas") return c.pago;
    if (filtro === "vencidas") return !c.pago && c.vencimento < hoje;
    return true;
  }).sort((a, b) => a.vencimento.localeCompare(b.vencimento));

  const totalPendente = contas.filter(c => !c.pago).reduce((s, c) => s + c.valor, 0);
  const totalVencido = contas.filter(c => !c.pago && c.vencimento < hoje).reduce((s, c) => s + c.valor, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addConta({
      descricao: form.descricao, valor: parseFloat(form.valor),
      vencimento: form.vencimento, categoria: form.categoria,
      recorrente: form.recorrente, pago: false,
    });
    setForm({ descricao: "", valor: "", vencimento: "", categoria: "", recorrente: false });
    setMostrarForm(false);
  }

  function marcarPago(id: string) {
    updateConta(id, { pago: true, dataPagamento: hoje });
  }

  function statusConta(c: typeof contas[0]) {
    if (c.pago) return { label: "Pago", cor: "bg-green-100 text-green-700" };
    if (c.vencimento < hoje) return { label: "Vencida", cor: "bg-red-100 text-red-700" };
    const diff = (new Date(c.vencimento).getTime() - new Date(hoje).getTime()) / 864e5;
    if (diff <= 3) return { label: `Vence em ${diff | 0}d`, cor: "bg-orange-100 text-orange-700" };
    return { label: "Em dia", cor: "bg-blue-100 text-blue-700" };
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Contas a Pagar</h1>
          <p className="text-[13px] text-[#999] mt-1">
            Pendente: <span className="text-[#1a1a2e] font-medium">{F(totalPendente)}</span>
            {totalVencido > 0 && <> · Vencido: <span className="text-red-500 font-medium">{F(totalVencido)}</span></>}
          </p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="bg-[#1B3A5C] text-white px-5 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#243F6B]">+ Nova Conta</button>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-[11px] text-[#999] uppercase font-semibold">Pendentes</p>
          <p className="text-xl font-bold text-[#1a1a2e] mt-1">{contas.filter(c => !c.pago).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-[11px] text-[#999] uppercase font-semibold">Vencidas</p>
          <p className="text-xl font-bold text-red-500 mt-1">{contas.filter(c => !c.pago && c.vencimento < hoje).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-[11px] text-[#999] uppercase font-semibold">Pagas</p>
          <p className="text-xl font-bold text-green-600 mt-1">{contas.filter(c => c.pago).length}</p>
        </div>
      </div>

      {/* Form */}
      {mostrarForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 animate-slideDown">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Nova Conta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Descrição *</label><input type="text" required value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Ex: Aluguel" /></div>
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Valor (R$) *</label><input type="number" required step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Vencimento *</label><input type="date" required value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Categoria</label><select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] bg-white"><option value="">Geral</option>{categorias.filter(c => c.tipo !== "Receita").map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}</select></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.recorrente} onChange={e => setForm({ ...form, recorrente: e.target.checked })} className="w-4 h-4 accent-[#D4A843]" /><span className="text-[13px] text-[#666]">Conta recorrente (mensal)</span></label>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#1B3A5C] text-white px-6 py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Criar Conta</button>
              <button type="button" onClick={() => setMostrarForm(false)} className="border border-gray-200 text-[#666] px-6 py-2.5 text-[13px] rounded-lg">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(["pendentes", "vencidas", "pagas", "todas"] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)} className={`px-3 py-1.5 rounded-lg text-[12px] ${filtro === f ? "bg-[#1B3A5C] text-white" : "bg-white border border-gray-200 text-[#666]"}`}>
            {f === "pendentes" ? "Pendentes" : f === "vencidas" ? "Vencidas" : f === "pagas" ? "Pagas" : "Todas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtradas.map(c => {
          const status = statusConta(c);
          return (
            <div key={c.id} className={`bg-white rounded-xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4 ${c.pago ? "opacity-60" : ""}`}>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-medium text-[#1a1a2e]">{c.descricao}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status.cor}`}>{status.label}</span>
                  {c.recorrente && <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Recorrente</span>}
                </div>
                <p className="text-[12px] text-[#999]">
                  Vencimento: {new Date(c.vencimento).toLocaleDateString("pt-BR")}
                  {c.categoria && ` · ${c.categoria}`}
                  {c.dataPagamento && ` · Pago em ${new Date(c.dataPagamento).toLocaleDateString("pt-BR")}`}
                </p>
              </div>
              <p className="text-[18px] font-bold text-[#1a1a2e]">{F(c.valor)}</p>
              <div className="flex gap-2">
                {!c.pago && <button onClick={() => marcarPago(c.id)} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-[12px] font-medium hover:bg-green-100">Marcar como pago</button>}
                <button onClick={() => removeConta(c.id)} className="text-red-400 hover:text-red-600 text-[12px] px-2">Excluir</button>
              </div>
            </div>
          );
        })}
        {filtradas.length === 0 && <p className="text-center text-[#999] py-12 text-[13px] bg-white rounded-xl border border-gray-100">Nenhuma conta {filtro !== "todas" ? `${filtro}` : "cadastrada"}.</p>}
      </div>
    </div>
  );
}

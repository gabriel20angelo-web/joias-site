"use client";
import { useFinanceiro } from "@/context/FinanceiroContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NovoLancamento() {
  const { addTransacao, categorias } = useFinanceiro();
  const router = useRouter();
  const [form, setForm] = useState({
    data: new Date().toISOString().split("T")[0],
    tipo: "Receita" as "Receita" | "Despesa",
    categoria: "",
    subcategoria: "",
    item: "",
    qtd: "1",
    valorUn: "",
    metodo: "PIX",
    notas: "",
  });

  const catsFiltradas = categorias.filter(c => c.tipo === form.tipo || c.tipo === "Ambos");
  const catSelecionada = categorias.find(c => c.nome === form.categoria);
  const subcats = catSelecionada?.subcategorias || [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addTransacao({
      data: form.data,
      tipo: form.tipo,
      natureza: catSelecionada?.natureza || "Variável",
      categoria: form.categoria,
      subcategoria: form.subcategoria,
      item: form.item,
      qtd: parseInt(form.qtd) || 1,
      valorUn: parseFloat(form.valorUn) || 0,
      metodo: form.metodo,
      notas: form.notas,
    });
    // Reset ou voltar
    if (form.tipo === "Receita") {
      setForm(prev => ({ ...prev, item: "", qtd: "1", valorUn: "", notas: "" }));
    } else {
      router.push("/admin/financeiro");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-[#999] hover:text-[#1a1a2e]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        </button>
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">Novo Lançamento</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Tipo toggle */}
        <div className="flex gap-2">
          <button type="button" onClick={() => setForm({ ...form, tipo: "Receita", categoria: "" })} className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all ${form.tipo === "Receita" ? "bg-green-600 text-white shadow-md" : "bg-white border border-gray-200 text-[#666]"}`}>
            + Receita
          </button>
          <button type="button" onClick={() => setForm({ ...form, tipo: "Despesa", categoria: "" })} className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all ${form.tipo === "Despesa" ? "bg-red-500 text-white shadow-md" : "bg-white border border-gray-200 text-[#666]"}`}>
            - Despesa
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Data *</label><input type="date" required value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Método *</label><select value={form.metodo} onChange={e => setForm({ ...form, metodo: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] bg-white">{["PIX", "Dinheiro", "Cartão Débito", "Cartão Crédito", "Transferência"].map(m => <option key={m}>{m}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Categoria *</label><select required value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value, subcategoria: "" })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] bg-white"><option value="">Selecione...</option>{catsFiltradas.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}</select></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Subcategoria</label><select value={form.subcategoria} onChange={e => setForm({ ...form, subcategoria: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] bg-white"><option value="">Selecione...</option>{subcats.map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Descrição / Item</label><input type="text" value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Ex: Colar Pérolas, Conta de luz..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Quantidade *</label><input type="number" required min="1" value={form.qtd} onChange={e => setForm({ ...form, qtd: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Valor Unitário (R$) *</label><input type="number" required step="0.01" min="0" value={form.valorUn} onChange={e => setForm({ ...form, valorUn: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
          {form.qtd && form.valorUn && (
            <div className={`text-center py-3 rounded-lg text-[16px] font-bold ${form.tipo === "Receita" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              Total: R$ {((parseInt(form.qtd) || 0) * (parseFloat(form.valorUn) || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          )}
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Observações</label><input type="text" value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Opcional..." /></div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className={`flex-1 text-white py-3 text-[14px] font-semibold rounded-xl ${form.tipo === "Receita" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}>
            {form.tipo === "Receita" ? "Registrar Receita" : "Registrar Despesa"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";
import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminFrete() {
  const { fretesPorRegiao, setFretesPorRegiao, config, atualizarConfig } = useLoja();
  const [form, setForm] = useState({ regiao: "", valor: "", prazo: "" });

  function adicionar(e: React.FormEvent) {
    e.preventDefault();
    setFretesPorRegiao([...fretesPorRegiao, { regiao: form.regiao, valor: parseFloat(form.valor), prazo: form.prazo }]);
    setForm({ regiao: "", valor: "", prazo: "" });
  }

  function remover(regiao: string) { setFretesPorRegiao(fretesPorRegiao.filter(f => f.regiao !== regiao)); }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Frete e Envio</h1>
      <p className="text-[13px] text-[#999] mb-8">Configure as opções de frete por região</p>

      {/* Frete grátis */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Frete Grátis</h2>
        <div className="flex items-center gap-4">
          <label className="text-[13px] text-[#666]">Frete grátis para compras acima de</label>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#999]">R$</span>
            <input type="number" value={config.freteGratisMinimo} onChange={e => atualizarConfig({ freteGratisMinimo: parseInt(e.target.value) || 0 })} className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#D4A843] text-center" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tabela */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50"><tr>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Região</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Valor</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Prazo</th>
                <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-[#999] font-medium">Ação</th>
              </tr></thead>
              <tbody>
                {fretesPorRegiao.map(f => (
                  <tr key={f.regiao} className="border-t border-gray-50">
                    <td className="px-4 py-3 font-medium text-[#1a1a2e]">{f.regiao}</td>
                    <td className="px-4 py-3 text-[#D4A843] font-medium">R$ {f.valor.toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#666]">{f.prazo}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => remover(f.regiao)} className="text-red-400 hover:text-red-600 text-[12px]">Excluir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fretesPorRegiao.length === 0 && <p className="text-center text-[#999] py-8 text-[13px]">Nenhuma região cadastrada.</p>}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 self-start">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Nova Região</h2>
          <form onSubmit={adicionar} className="space-y-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Região *</label><input type="text" required value={form.regiao} onChange={e => setForm({...form, regiao: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Ex: Sudeste" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Valor (R$) *</label><input type="number" required step="0.01" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Prazo *</label><input type="text" required value={form.prazo} onChange={e => setForm({...form, prazo: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="5-8 dias úteis" /></div>
            </div>
            <button type="submit" className="w-full bg-[#1B3A5C] text-white py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Adicionar Região</button>
          </form>
        </div>
      </div>
    </div>
  );
}

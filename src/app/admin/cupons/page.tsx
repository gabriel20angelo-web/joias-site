"use client";

import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminCupons() {
  const { cupons, adicionarCupom, atualizarCupom, removerCupom } = useLoja();
  const [form, setForm] = useState({ codigo: "", desconto: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const codigo = form.codigo.toUpperCase().trim();
    if (cupons.find((c) => c.codigo === codigo)) return alert("Cupom já existe!");
    adicionarCupom({ codigo, desconto: parseFloat(form.desconto), ativo: true });
    setForm({ codigo: "", desconto: "" });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Cupons de Desconto</h1>
      <p className="text-[13px] text-[#999] mb-8">Crie e gerencie cupons promocionais</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Lista */}
        <div className="space-y-3">
          {cupons.map((c) => (
            <div key={c.codigo} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <p className="text-[15px] font-mono font-bold text-[#1a1a2e] tracking-wider">{c.codigo}</p>
                <p className="text-[12px] text-[#999] mt-0.5">{c.desconto}% de desconto</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => atualizarCupom(c.codigo, { ativo: !c.ativo })}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${c.ativo ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                  {c.ativo ? "Ativo" : "Inativo"}
                </button>
                <button onClick={() => removerCupom(c.codigo)} className="text-red-400 hover:text-red-600 text-[12px]">Excluir</button>
              </div>
            </div>
          ))}
          {cupons.length === 0 && <p className="text-[#999] text-[13px] text-center py-8">Nenhum cupom cadastrado.</p>}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 self-start">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Novo Cupom</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Codigo *</label><input type="text" required value={form.codigo} onChange={(e) => setForm({...form, codigo: e.target.value.toUpperCase()})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] font-mono uppercase" placeholder="MEUCUPOM" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Desconto (%) *</label><input type="number" required min="1" max="100" value={form.desconto} onChange={(e) => setForm({...form, desconto: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="10" /></div>
            <button type="submit" className="w-full bg-[#1B3A5C] text-white py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Criar Cupom</button>
          </form>
        </div>
      </div>
    </div>
  );
}

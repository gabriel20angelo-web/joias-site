"use client";

import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminDepoimentos() {
  const { depoimentos, adicionarDepoimento, removerDepoimento } = useLoja();
  const [form, setForm] = useState({ nome: "", texto: "", nota: "5", produto: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    adicionarDepoimento({ nome: form.nome, texto: form.texto, nota: parseInt(form.nota), produto: form.produto });
    setForm({ nome: "", texto: "", nota: "5", produto: "" });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Depoimentos</h1>
      <p className="text-[13px] text-[#999] mb-8">Gerencie os depoimentos exibidos na página inicial</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Lista */}
        <div className="space-y-3">
          {depoimentos.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#F0E8D8] flex items-center justify-center text-[11px] font-medium text-[#D4A843]">{d.nome.charAt(0)}</div>
                    <div>
                      <p className="text-[13px] font-medium text-[#1a1a2e]">{d.nome}</p>
                      <p className="text-[10px] text-[#999]">{d.produto}</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#666] italic">&ldquo;{d.texto}&rdquo;</p>
                  <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: d.nota }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-[#D4A843]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" /></svg>
                    ))}
                  </div>
                </div>
                <button onClick={() => removerDepoimento(d.id)} className="text-red-400 hover:text-red-600 text-[12px] shrink-0">Excluir</button>
              </div>
            </div>
          ))}
          {depoimentos.length === 0 && <p className="text-[#999] text-center py-8 text-[13px]">Nenhum depoimento.</p>}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 self-start">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Novo Depoimento</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Nome *</label><input type="text" required value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Maria S." /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Produto *</label><input type="text" required value={form.produto} onChange={(e) => setForm({...form, produto: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Nome do produto" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Depoimento *</label><textarea required value={form.texto} onChange={(e) => setForm({...form, texto: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] resize-none h-20" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Nota</label><select value={form.nota} onChange={(e) => setForm({...form, nota: e.target.value})} className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] bg-white">{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} estrelas</option>)}</select></div>
            <button type="submit" className="w-full bg-[#1B3A5C] text-white py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Adicionar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

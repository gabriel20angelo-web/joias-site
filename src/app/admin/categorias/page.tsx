"use client";
import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminCategorias() {
  const { categorias, adicionarCategoria, atualizarCategoria, removerCategoria } = useLoja();
  const [form, setForm] = useState({ nome: "", emoji: "💎", descricao: "", ativo: true });
  const [editando, setEditando] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editando) {
      atualizarCategoria(editando, form);
      setEditando(null);
    } else {
      adicionarCategoria(form);
    }
    setForm({ nome: "", emoji: "💎", descricao: "", ativo: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Categorias</h1>
      <p className="text-[13px] text-[#999] mb-8">Gerencie as categorias de produtos</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {categorias.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <p className="text-[14px] font-medium text-[#1a1a2e]">{c.nome}</p>
                  <p className="text-[11px] text-[#999]">{c.descricao}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => atualizarCategoria(c.id, { ativo: !c.ativo })} className={`px-3 py-1 rounded-full text-[11px] font-medium ${c.ativo ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>{c.ativo ? "Ativa" : "Inativa"}</button>
                <button onClick={() => { setEditando(c.id); setForm({ nome: c.nome, emoji: c.emoji, descricao: c.descricao, ativo: c.ativo }); }} className="text-[#D4A843] text-[12px] font-medium">Editar</button>
                <button onClick={() => removerCategoria(c.id)} className="text-red-400 text-[12px]">Excluir</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 self-start">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">{editando ? "Editar Categoria" : "Nova Categoria"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-[1fr_80px] gap-4">
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Nome *</label><input type="text" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Ex: Colares" /></div>
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Emoji</label><input type="text" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] text-center text-xl" /></div>
            </div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Descrição</label><input type="text" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Breve descrição" /></div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#1B3A5C] text-white px-6 py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">{editando ? "Salvar" : "Criar Categoria"}</button>
              {editando && <button type="button" onClick={() => { setEditando(null); setForm({ nome: "", emoji: "💎", descricao: "", ativo: true }); }} className="border border-gray-200 text-[#666] px-6 py-2.5 text-[13px] rounded-lg">Cancelar</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

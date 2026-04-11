"use client";

import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminBanners() {
  const { banners, adicionarBanner, atualizarBanner, removerBanner } = useLoja();
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState({ subtitulo: "", titulo1: "", titulo2: "", descricao: "", link: "/catalogo", textoBotao: "Ver Mais", bg: "#FBF8F3" });

  function handleNovo(e: React.FormEvent) {
    e.preventDefault();
    adicionarBanner({ subtitulo: form.subtitulo, titulo: [form.titulo1, form.titulo2], descricao: form.descricao, link: form.link, textoBotao: form.textoBotao, bg: form.bg, ativo: true });
    setForm({ subtitulo: "", titulo1: "", titulo2: "", descricao: "", link: "/catalogo", textoBotao: "Ver Mais", bg: "#FBF8F3" });
  }

  function iniciarEdicao(id: string) {
    const b = banners.find((x) => x.id === id);
    if (b) {
      setEditando(id);
      setForm({ subtitulo: b.subtitulo, titulo1: b.titulo[0], titulo2: b.titulo[1], descricao: b.descricao, link: b.link, textoBotao: b.textoBotao, bg: b.bg });
    }
  }

  function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (editando) {
      atualizarBanner(editando, { subtitulo: form.subtitulo, titulo: [form.titulo1, form.titulo2], descricao: form.descricao, link: form.link, textoBotao: form.textoBotao, bg: form.bg });
      setEditando(null);
      setForm({ subtitulo: "", titulo1: "", titulo2: "", descricao: "", link: "/catalogo", textoBotao: "Ver Mais", bg: "#FBF8F3" });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Banners</h1>
      <p className="text-[13px] text-[#999] mb-8">Gerencie os banners do carrossel da página inicial</p>

      {/* Lista */}
      <div className="space-y-4 mb-8">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[250px]">
              <div className="w-16 h-12 rounded-lg flex items-center justify-center text-[10px] text-[#666] font-medium border" style={{ backgroundColor: b.bg }}>
                Preview
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#1a1a2e]">{b.titulo[0]} {b.titulo[1]}</p>
                <p className="text-[11px] text-[#999]">{b.subtitulo} — {b.descricao.slice(0, 60)}...</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => atualizarBanner(b.id, { ativo: !b.ativo })}
                className={`px-3 py-1 rounded-full text-[11px] font-medium ${b.ativo ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {b.ativo ? "Ativo" : "Inativo"}
              </button>
              <button onClick={() => iniciarEdicao(b.id)} className="text-[#D4A843] hover:text-[#C49A30] text-[12px] font-medium">Editar</button>
              <button onClick={() => removerBanner(b.id)} className="text-red-400 hover:text-red-600 text-[12px]">Excluir</button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-center text-[#999] py-8 text-[13px]">Nenhum banner cadastrado.</p>}
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">{editando ? "Editar Banner" : "Novo Banner"}</h2>
        <form onSubmit={editando ? salvarEdicao : handleNovo} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Subtitulo</label><input type="text" required value={form.subtitulo} onChange={(e) => setForm({...form, subtitulo: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Ex: Nova Coleção" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Cor de fundo</label><div className="flex gap-2 items-center"><input type="color" value={form.bg} onChange={(e) => setForm({...form, bg: e.target.value})} className="w-10 h-10 border border-gray-200 rounded cursor-pointer" /><span className="text-[12px] text-[#999]">{form.bg}</span></div></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Titulo linha 1 *</label><input type="text" required value={form.titulo1} onChange={(e) => setForm({...form, titulo1: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Titulo linha 2 *</label><input type="text" required value={form.titulo2} onChange={(e) => setForm({...form, titulo2: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Descricao</label><textarea value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] resize-none h-16" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Link</label><input type="text" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Texto do botao</label><input type="text" value={form.textoBotao} onChange={(e) => setForm({...form, textoBotao: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#1B3A5C] text-white px-6 py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">{editando ? "Salvar" : "Adicionar Banner"}</button>
            {editando && <button type="button" onClick={() => { setEditando(null); setForm({ subtitulo: "", titulo1: "", titulo2: "", descricao: "", link: "/catalogo", textoBotao: "Ver Mais", bg: "#FBF8F3" }); }} className="border border-gray-200 text-[#666] px-6 py-2.5 text-[13px] rounded-lg">Cancelar</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

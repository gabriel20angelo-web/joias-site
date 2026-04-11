"use client";
import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminPaginas() {
  const { paginas, setPaginas } = useLoja();
  const [editando, setEditando] = useState<string | null>(null);
  const [conteudo, setConteudo] = useState("");

  function iniciarEdicao(id: string) {
    const p = paginas.find(x => x.id === id);
    if (p) { setEditando(id); setConteudo(p.conteudo); }
  }

  function salvar() {
    if (editando) {
      setPaginas(paginas.map(p => p.id === editando ? { ...p, conteudo } : p));
      setEditando(null);
      setConteudo("");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Páginas</h1>
      <p className="text-[13px] text-[#999] mb-8">Edite o conteúdo das páginas do site</p>

      {editando ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-[#1a1a2e]">Editando: {paginas.find(p => p.id === editando)?.titulo}</h2>
            <button onClick={() => setEditando(null)} className="text-[#999] text-[12px]">Cancelar</button>
          </div>
          <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#D4A843] resize-none h-64 leading-relaxed" placeholder="Escreva o conteúdo da página..." />
          <p className="text-[11px] text-[#999] mt-2 mb-4">Dica: Esse texto aparece na página correspondente do site.</p>
          <button onClick={salvar} className="bg-[#1B3A5C] text-white px-8 py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Salvar Conteúdo</button>
        </div>
      ) : (
        <div className="space-y-3">
          {paginas.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">{p.titulo}</p>
                <p className="text-[12px] text-[#999] mt-1">{p.conteudo ? `${p.conteudo.slice(0, 100)}...` : "Sem conteúdo personalizado"}</p>
              </div>
              <button onClick={() => iniciarEdicao(p.id)} className="text-[#D4A843] text-[12px] font-medium">Editar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

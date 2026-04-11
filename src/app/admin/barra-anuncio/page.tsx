"use client";
import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminBarraAnuncio() {
  const { avisosBarra, setAvisosBarra, config } = useLoja();
  const [novoTexto, setNovoTexto] = useState("");

  function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!novoTexto.trim()) return;
    setAvisosBarra([...avisosBarra, { id: Date.now().toString(36), texto: novoTexto.toUpperCase(), ativo: true }]);
    setNovoTexto("");
  }

  function remover(id: string) { setAvisosBarra(avisosBarra.filter(a => a.id !== id)); }
  function toggleAtivo(id: string) { setAvisosBarra(avisosBarra.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a)); }
  function atualizar(id: string, texto: string) { setAvisosBarra(avisosBarra.map(a => a.id === id ? { ...a, texto } : a)); }

  // Substituir variáveis pra preview
  function preview(texto: string) {
    return texto.replace("${freteGratisMinimo}", config.freteGratisMinimo.toString()).replace("${maxParcelas}", config.maxParcelas.toString());
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Barra de Anúncio</h1>
      <p className="text-[13px] text-[#999] mb-2">Mensagens que aparecem no topo do site</p>
      <p className="text-[11px] text-[#D4A843] mb-8">Use <code className="bg-gray-100 px-1 rounded">${`{freteGratisMinimo}`}</code> e <code className="bg-gray-100 px-1 rounded">${`{maxParcelas}`}</code> para valores dinâmicos</p>

      <div className="space-y-3 mb-8">
        {avisosBarra.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <button onClick={() => toggleAtivo(a.id)} className={`px-3 py-1 rounded-full text-[11px] font-medium shrink-0 ${a.ativo ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>{a.ativo ? "Ativo" : "Inativo"}</button>
            <input type="text" value={a.texto} onChange={e => atualizar(a.id, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#D4A843] font-mono uppercase" />
            <span className="text-[11px] text-[#999] shrink-0 hidden md:block">{preview(a.texto)}</span>
            <button onClick={() => remover(a.id)} className="text-red-400 hover:text-red-600 text-[12px] shrink-0">Excluir</button>
          </div>
        ))}
      </div>

      <form onSubmit={adicionar} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Nova Mensagem</h2>
        <div className="flex gap-3">
          <input type="text" value={novoTexto} onChange={e => setNovoTexto(e.target.value)} placeholder="Ex: FRETE GRÁTIS ACIMA DE R$199" className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] uppercase" />
          <button type="submit" className="bg-[#1B3A5C] text-white px-6 py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Adicionar</button>
        </div>
      </form>
    </div>
  );
}

"use client";
import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminWhatsApp() {
  const { msgsWhatsApp, setMsgsWhatsApp, config } = useLoja();
  const [form, setForm] = useState({ titulo: "", mensagem: "" });
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  function adicionar(e: React.FormEvent) {
    e.preventDefault();
    setMsgsWhatsApp([...msgsWhatsApp, { id: Date.now().toString(36), ...form }]);
    setForm({ titulo: "", mensagem: "" });
  }

  function remover(id: string) { setMsgsWhatsApp(msgsWhatsApp.filter(m => m.id !== id)); }

  function copiar(id: string, msg: string) {
    navigator.clipboard.writeText(msg);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  }

  function enviar(msg: string) {
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Templates WhatsApp</h1>
      <p className="text-[13px] text-[#999] mb-8">Mensagens prontas para enviar aos clientes</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {msgsWhatsApp.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-[14px] font-medium text-[#1a1a2e] mb-2">{m.titulo}</p>
              <p className="text-[13px] text-[#666] bg-gray-50 rounded-lg p-3 mb-3 whitespace-pre-wrap">{m.mensagem}</p>
              <div className="flex gap-2">
                <button onClick={() => copiar(m.id, m.mensagem)} className="text-[12px] text-[#D4A843] font-medium">{copiadoId === m.id ? "Copiado!" : "Copiar"}</button>
                <button onClick={() => enviar(m.mensagem)} className="text-[12px] text-green-600 font-medium">Enviar</button>
                <button onClick={() => remover(m.id)} className="text-[12px] text-red-400 ml-auto">Excluir</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 self-start">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Novo Template</h2>
          <form onSubmit={adicionar} className="space-y-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Título *</label><input type="text" required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Ex: Boas-vindas" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Mensagem *</label><textarea required value={form.mensagem} onChange={e => setForm({...form, mensagem: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] resize-none h-28" placeholder="Olá! Bem-vinda à AURA MEL..." /></div>
            <button type="submit" className="w-full bg-[#1B3A5C] text-white py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Criar Template</button>
          </form>
        </div>
      </div>
    </div>
  );
}

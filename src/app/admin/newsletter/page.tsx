"use client";

import { useState, useEffect } from "react";

export default function AdminNewsletter() {
  const [inscritos, setInscritos] = useState<{ email: string; data: string }[]>([]);
  const [novoEmail, setNovoEmail] = useState("");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("newsletter_inscritos");
      if (salvo) setInscritos(JSON.parse(salvo));
    } catch {}
  }, []);

  function salvar(novos: typeof inscritos) {
    setInscritos(novos);
    localStorage.setItem("newsletter_inscritos", JSON.stringify(novos));
  }

  function adicionar(e: React.FormEvent) {
    e.preventDefault();
    const email = novoEmail.trim().toLowerCase();
    if (!email || inscritos.find(i => i.email === email)) return;
    salvar([{ email, data: new Date().toISOString() }, ...inscritos]);
    setNovoEmail("");
  }

  function remover(email: string) {
    salvar(inscritos.filter(i => i.email !== email));
  }

  function exportarCSV() {
    const csv = "Email,Data\n" + inscritos.map(i => `${i.email},${new Date(i.data).toLocaleDateString("pt-BR")}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Newsletter</h1>
          <p className="text-[13px] text-[#999] mt-1">{inscritos.length} inscritos</p>
        </div>
        {inscritos.length > 0 && (
          <button onClick={exportarCSV} className="bg-[#1B3A5C] text-white px-5 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Exportar CSV
          </button>
        )}
      </div>

      {/* Adicionar manual */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <form onSubmit={adicionar} className="flex gap-3">
          <input type="email" required value={novoEmail} onChange={e => setNovoEmail(e.target.value)} placeholder="Adicionar email manualmente..." className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" />
          <button type="submit" className="bg-[#D4A843] text-white px-6 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#C49A30]">Adicionar</button>
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {inscritos.length === 0 ? (
          <p className="text-center text-[#999] py-12 text-[13px]">Nenhum inscrito ainda. Os e-mails cadastrados no site aparecerao aqui.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Email</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#999] font-medium">Data</th>
              <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-[#999] font-medium">Acao</th>
            </tr></thead>
            <tbody>
              {inscritos.map(i => (
                <tr key={i.email} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-[#1a1a2e]">{i.email}</td>
                  <td className="px-4 py-3 text-[#999]">{new Date(i.data).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remover(i.email)} className="text-red-400 hover:text-red-600 text-[12px]">Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

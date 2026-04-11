"use client";

import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminConfiguracoes() {
  const { config, atualizarConfig, resetarTudo } = useLoja();
  const [form, setForm] = useState(config);
  const [salvo, setSalvo] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    atualizarConfig(form);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Configurações</h1>
      <p className="text-[13px] text-[#999] mb-8">Configure as informações da sua loja</p>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] border-b pb-3">Identidade</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Nome da Loja</label><input type="text" value={form.nomeLoja} onChange={(e) => setForm({...form, nomeLoja: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Tagline</label><input type="text" value={form.tagline} onChange={(e) => setForm({...form, tagline: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] border-b pb-3">Contato</h2>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">WhatsApp (com DDI)</label><input type="text" value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="5511999999999" /></div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">E-mail</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Instagram</label><input type="text" value={form.instagram} onChange={(e) => setForm({...form, instagram: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">TikTok</label><input type="text" value={form.tiktok} onChange={(e) => setForm({...form, tiktok: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] border-b pb-3">Empresa</h2>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">CNPJ</label><input type="text" value={form.cnpj} onChange={(e) => setForm({...form, cnpj: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="00.000.000/0001-00" /></div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Endereço</label><input type="text" value={form.endereco} onChange={(e) => setForm({...form, endereco: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Rua, número, cidade - UF" /></div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Horário de Funcionamento</label><input type="text" value={form.horarioFuncionamento} onChange={(e) => setForm({...form, horarioFuncionamento: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Segunda a Sexta, 9h às 18h" /></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] border-b pb-3">Vendas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Frete grátis acima de (R$)</label><input type="number" value={form.freteGratisMinimo} onChange={(e) => setForm({...form, freteGratisMinimo: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Max parcelas</label><input type="number" min="1" max="12" value={form.maxParcelas} onChange={(e) => setForm({...form, maxParcelas: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-[#1B3A5C] text-white px-8 py-3 text-[13px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center gap-2">
            {salvo ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> Salvo!</>
            ) : "Salvar Configurações"}
          </button>
        </div>
      </form>

      {/* Atalhos para outras configurações */}
      <div className="mt-8 max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { href: "/admin/barra-anuncio", label: "Barra de Anúncio", desc: "Mensagens do topo", icon: "📢" },
          { href: "/admin/frete", label: "Frete e Envio", desc: "Valores por região", icon: "🚚" },
          { href: "/admin/aparencia", label: "Aparência", desc: "Cores e temas", icon: "🎨" },
          { href: "/admin/paginas", label: "Páginas", desc: "Conteúdo do site", icon: "📄" },
          { href: "/admin/whatsapp", label: "WhatsApp", desc: "Templates prontos", icon: "💬" },
          { href: "/admin/logs", label: "Logs", desc: "Histórico de ações", icon: "📋" },
        ].map(item => (
          <a key={item.href} href={item.href} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#D4A843] hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-1"><span>{item.icon}</span><span className="text-[13px] font-medium text-[#1a1a2e]">{item.label}</span></div>
            <p className="text-[11px] text-[#999]">{item.desc}</p>
          </a>
        ))}
      </div>

      {/* Backup */}
      <div className="mt-12 max-w-3xl bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-2">Backup e Restauração</h2>
        <p className="text-[12px] text-[#666] mb-4">Exporte todos os dados da loja ou restaure a partir de um backup.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const dados: Record<string, unknown> = {};
              ["loja_produtos", "loja_banners", "loja_cupons", "loja_depoimentos", "loja_config", "loja_pedidos", "loja_tema", "estoque_historico", "newsletter_inscritos"].forEach(k => {
                const v = localStorage.getItem(k);
                if (v) dados[k] = JSON.parse(v);
              });
              const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `auramel_backup_${new Date().toISOString().split("T")[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-[#1B3A5C] text-white px-6 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Exportar Backup (JSON)
          </button>
          <label className="border border-gray-200 text-[#666] px-6 py-2.5 text-[12px] font-medium rounded-lg hover:border-[#D4A843] cursor-pointer flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            Importar Backup
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const dados = JSON.parse(ev.target?.result as string);
                    Object.entries(dados).forEach(([k, v]) => {
                      localStorage.setItem(k, JSON.stringify(v));
                    });
                    alert("Backup restaurado! Recarregando...");
                    window.location.reload();
                  } catch {
                    alert("Arquivo inválido.");
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>
          <button
            onClick={() => {
              const dados: Record<string, unknown> = {};
              ["loja_produtos", "loja_pedidos"].forEach(k => {
                const v = localStorage.getItem(k);
                if (v) dados[k] = JSON.parse(v);
              });
              const produtos = (dados.loja_produtos as Array<Record<string, unknown>>) || [];
              const csv = "ID,Nome,Categoria,Preco,Preco Promo,Estoque,Destaque,Novo\n" +
                produtos.map((p: Record<string, unknown>) => `${p.id},"${p.nome}",${p.categoria},${p.preco},${p.precoPromocional || ""},${p.estoque},${p.destaque},${p.novo}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `auramel_produtos_${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="border border-gray-200 text-[#666] px-6 py-2.5 text-[12px] font-medium rounded-lg hover:border-[#D4A843] flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            Exportar Produtos (CSV)
          </button>
        </div>
      </div>

      {/* Senha admin */}
      <div className="mt-8 max-w-3xl bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-2">Senha do Admin</h2>
        <p className="text-[12px] text-[#666] mb-4">Altere a senha de acesso ao painel (padrao: auramel2026)</p>
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).elements.namedItem("novaSenha") as HTMLInputElement;
          if (input.value.length >= 4) {
            localStorage.setItem("admin_senha", input.value);
            input.value = "";
            alert("Senha alterada com sucesso!");
          } else {
            alert("Senha deve ter pelo menos 4 caracteres.");
          }
        }} className="flex gap-3">
          <input name="novaSenha" type="password" placeholder="Nova senha..." minLength={4} className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" />
          <button type="submit" className="bg-[#D4A843] text-white px-6 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#C49A30]">Alterar</button>
        </form>
      </div>

      {/* Reset */}
      <div className="mt-8 max-w-3xl bg-red-50 rounded-xl p-6 border border-red-100">
        <h2 className="text-[14px] font-semibold text-red-700 mb-2">Zona de Perigo</h2>
        <p className="text-[12px] text-red-600/70 mb-4">Resetar todos os dados para os valores padrao. Isso ira apagar todas as alteracoes feitas no admin.</p>
        {confirmReset ? (
          <div className="flex gap-3">
            <button onClick={() => { resetarTudo(); setConfirmReset(false); setForm(config); }} className="bg-red-600 text-white px-6 py-2 text-[13px] font-medium rounded-lg hover:bg-red-700">Sim, resetar tudo</button>
            <button onClick={() => setConfirmReset(false)} className="border border-red-200 text-red-600 px-6 py-2 text-[13px] rounded-lg">Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="border border-red-300 text-red-600 px-6 py-2 text-[13px] rounded-lg hover:bg-red-100">Resetar Todos os Dados</button>
        )}
      </div>
    </div>
  );
}

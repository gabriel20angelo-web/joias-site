"use client";

import { useLoja } from "@/context/LojaContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

const coresDisponiveis = [
  { hex: "#D4AF37", nome: "Dourado" },
  { hex: "#C0C0C0", nome: "Prata" },
  { hex: "#E8C4C4", nome: "Rose" },
  { hex: "#1a1a2e", nome: "Preto" },
];

export default function EditarProdutoClient() {
  const { produtos, atualizarProduto } = useLoja();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const produto = produtos.find((p) => p.id === id);

  const [form, setForm] = useState({
    nome: "", descricao: "", descricaoCompleta: "", preco: "", precoPromocional: "",
    categoria: "Colares", estoque: "", material: "", peso: "",
    destaque: false, novo: false, maisVendido: false, cores: [] as string[],
    imagens: [] as string[],
  });

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome, descricao: produto.descricao,
        descricaoCompleta: produto.descricaoCompleta || "",
        preco: produto.preco.toString(), precoPromocional: produto.precoPromocional?.toString() || "",
        categoria: produto.categoria, estoque: produto.estoque.toString(),
        material: produto.material || "", peso: produto.peso || "",
        destaque: produto.destaque, novo: produto.novo || false,
        maisVendido: produto.maisVendido || false, cores: produto.cores || [],
        imagens: produto.imagens || [],
      });
    }
  }, [produto]);

  if (!produto) return <p className="text-center py-20 text-[#999]">Produto não encontrado.</p>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    atualizarProduto(id, {
      nome: form.nome, descricao: form.descricao, descricaoCompleta: form.descricaoCompleta || undefined,
      preco: parseFloat(form.preco), precoPromocional: form.precoPromocional ? parseFloat(form.precoPromocional) : undefined,
      categoria: form.categoria, estoque: parseInt(form.estoque),
      material: form.material || undefined, peso: form.peso || undefined,
      destaque: form.destaque, novo: form.novo, maisVendido: form.maisVendido, imagens: form.imagens,
      cores: form.cores.length > 0 ? form.cores : undefined,
    });
    router.push("/admin/produtos");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-[#999] hover:text-[#1a1a2e]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Editar Produto</h1>
          <p className="text-[13px] text-[#999] mt-1">#{id} - {produto.nome}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-[14px] font-semibold border-b pb-3">Informações</h2>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Nome *</label><input type="text" required value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Descricao curta *</label><textarea required value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] resize-none h-20" /></div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-1">Descricao completa</label><textarea value={form.descricaoCompleta} onChange={(e) => setForm({...form, descricaoCompleta: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] resize-none h-32" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Categoria</label><select value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] bg-white">{["Colares","Brincos","Anéis","Pulseiras","Conjuntos","Tornozeleiras"].map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Estoque</label><input type="number" required min="0" value={form.estoque} onChange={(e) => setForm({...form, estoque: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-[14px] font-semibold border-b pb-3">Precos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Preco (R$)</label><input type="number" required step="0.01" value={form.preco} onChange={(e) => setForm({...form, preco: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Preco promo</label><input type="number" step="0.01" value={form.precoPromocional} onChange={(e) => setForm({...form, precoPromocional: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Vazio = sem promo" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-[14px] font-semibold border-b pb-3">Detalhes</h2>
          {/* Upload de imagens */}
          <div>
            <label className="block text-[12px] font-medium text-[#666] mb-2">Fotos do Produto</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.imagens.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg border" />
                  <button type="button" onClick={() => setForm({...form, imagens: form.imagens.filter((_, j) => j !== i)})} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">×</button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#D4A843] transition-colors">
                <span className="text-[20px] text-[#ccc]">+</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => setForm(prev => ({...prev, imagens: [...prev.imagens, ev.target?.result as string]}));
                  reader.readAsDataURL(file);
                }} />
              </label>
            </div>
            <input type="text" placeholder="Ou cole URL da imagem e pressione Enter..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#D4A843]"
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) { setForm(prev => ({...prev, imagens: [...prev.imagens, v]})); (e.target as HTMLInputElement).value = ""; }}}} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Material</label><input type="text" value={form.material} onChange={(e) => setForm({...form, material: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Peso</label><input type="text" value={form.peso} onChange={(e) => setForm({...form, peso: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" /></div>
          </div>
          <div><label className="block text-[12px] font-medium text-[#666] mb-2">Cores</label><div className="flex gap-2">{coresDisponiveis.map((c) => (<button key={c.hex} type="button" onClick={() => setForm({...form, cores: form.cores.includes(c.hex) ? form.cores.filter(x=>x!==c.hex) : [...form.cores, c.hex]})} className={`w-8 h-8 rounded-full border-2 transition-all ${form.cores.includes(c.hex) ? "border-[#1a1a2e] scale-110" : "border-gray-200 opacity-50 hover:opacity-100"}`} style={{backgroundColor: c.hex}} title={c.nome} />))}</div></div>
          <div className="flex gap-6">{[{key:"destaque",label:"Destaque"},{key:"novo",label:"Novo"},{key:"maisVendido",label:"Mais Vendido"}].map((f) => (<label key={f.key} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form[f.key as keyof typeof form] as boolean} onChange={(e) => setForm({...form, [f.key]: e.target.checked})} className="w-4 h-4 accent-[#D4A843]" /><span className="text-[13px] text-[#666]">{f.label}</span></label>))}</div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-[#1B3A5C] text-white px-8 py-3 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Salvar Alteracoes</button>
          <button type="button" onClick={() => router.back()} className="border border-gray-200 text-[#666] px-8 py-3 text-[13px] rounded-lg">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

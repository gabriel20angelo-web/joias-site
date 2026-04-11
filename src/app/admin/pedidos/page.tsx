"use client";

import { useState, useEffect } from "react";
import { useLoja } from "@/context/LojaContext";

interface Pedido {
  id: string;
  cliente: string;
  whatsapp: string;
  itens: { produtoId: string; nome: string; quantidade: number; preco: number }[];
  total: number;
  status: "pendente" | "confirmado" | "enviado" | "entregue" | "cancelado";
  data: string;
  observacao: string;
}

const statusCores: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregue: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

function gerarId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

function formatarPreco(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

export default function AdminPedidos() {
  const { produtos } = useLoja();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ cliente: "", whatsapp: "", observacao: "" });
  const [itensForm, setItensForm] = useState<{ produtoId: string; quantidade: number }[]>([]);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("loja_pedidos");
      if (salvo) setPedidos(JSON.parse(salvo));
    } catch {}
  }, []);

  function salvar(novos: Pedido[]) {
    setPedidos(novos);
    localStorage.setItem("loja_pedidos", JSON.stringify(novos));
  }

  function criarPedido(e: React.FormEvent) {
    e.preventDefault();
    const itens = itensForm.filter(i => i.produtoId && i.quantidade > 0).map(i => {
      const p = produtos.find(x => x.id === i.produtoId);
      return { produtoId: i.produtoId, nome: p?.nome || "", quantidade: i.quantidade, preco: (p?.precoPromocional ?? p?.preco ?? 0) };
    });
    if (itens.length === 0) return;
    const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
    const pedido: Pedido = { id: gerarId(), cliente: form.cliente, whatsapp: form.whatsapp, itens, total, status: "pendente", data: new Date().toISOString(), observacao: form.observacao };
    salvar([pedido, ...pedidos]);
    setForm({ cliente: "", whatsapp: "", observacao: "" });
    setItensForm([]);
    setMostrarForm(false);
  }

  function mudarStatus(id: string, status: Pedido["status"]) {
    salvar(pedidos.map(p => p.id === id ? { ...p, status } : p));
  }

  function removerPedido(id: string) {
    salvar(pedidos.filter(p => p.id !== id));
  }

  const filtrados = filtroStatus === "todos" ? pedidos : pedidos.filter(p => p.status === filtroStatus);
  const totalVendas = pedidos.filter(p => p.status !== "cancelado").reduce((acc, p) => acc + p.total, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Pedidos</h1>
          <p className="text-[13px] text-[#999] mt-1">{pedidos.length} pedidos — Vendas: {formatarPreco(totalVendas)}</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="bg-[#1B3A5C] text-white px-5 py-2.5 text-[12px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Registrar Pedido
        </button>
      </div>

      {/* Form novo pedido */}
      {mostrarForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 animate-slideDown">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Novo Pedido</h2>
          <form onSubmit={criarPedido} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">Cliente *</label><input type="text" required value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Nome do cliente" /></div>
              <div><label className="block text-[12px] font-medium text-[#666] mb-1">WhatsApp</label><input type="text" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="11999999999" /></div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-2">Itens do pedido</label>
              {itensForm.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select value={item.produtoId} onChange={e => { const n = [...itensForm]; n[i].produtoId = e.target.value; setItensForm(n); }} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#D4A843] bg-white">
                    <option value="">Selecione...</option>
                    {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} — {formatarPreco(p.precoPromocional ?? p.preco)}</option>)}
                  </select>
                  <input type="number" min="1" value={item.quantidade} onChange={e => { const n = [...itensForm]; n[i].quantidade = parseInt(e.target.value) || 1; setItensForm(n); }} className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-center outline-none focus:border-[#D4A843]" />
                  <button type="button" onClick={() => setItensForm(itensForm.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">x</button>
                </div>
              ))}
              <button type="button" onClick={() => setItensForm([...itensForm, { produtoId: "", quantidade: 1 }])} className="text-[12px] text-[#D4A843] hover:text-[#C49A30] font-medium">+ Adicionar item</button>
            </div>
            <div><label className="block text-[12px] font-medium text-[#666] mb-1">Observacao</label><input type="text" value={form.observacao} onChange={e => setForm({...form, observacao: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]" placeholder="Observações do pedido..." /></div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#1B3A5C] text-white px-6 py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B]">Criar Pedido</button>
              <button type="button" onClick={() => setMostrarForm(false)} className="border border-gray-200 text-[#666] px-6 py-2.5 text-[13px] rounded-lg">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["todos", "pendente", "confirmado", "enviado", "entregue", "cancelado"].map(s => (
          <button key={s} onClick={() => setFiltroStatus(s)} className={`px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-colors ${filtroStatus === s ? "bg-[#1B3A5C] text-white" : "bg-white border border-gray-200 text-[#666] hover:border-gray-300"}`}>
            {s === "todos" ? "Todos" : statusLabels[s]} ({s === "todos" ? pedidos.length : pedidos.filter(p => p.status === s).length})
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtrados.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[14px] font-semibold text-[#1a1a2e]">{p.cliente}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${statusCores[p.status]}`}>{statusLabels[p.status]}</span>
                </div>
                <p className="text-[11px] text-[#999]">#{p.id} — {new Date(p.data).toLocaleString("pt-BR")} {p.whatsapp && `— ${p.whatsapp}`}</p>
              </div>
              <p className="text-[18px] font-bold text-[#1B3A5C]">{formatarPreco(p.total)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              {p.itens.map((item, i) => (
                <div key={i} className="flex justify-between text-[12px] py-1">
                  <span className="text-[#666]">{item.quantidade}x {item.nome}</span>
                  <span className="text-[#1a1a2e] font-medium">{formatarPreco(item.preco * item.quantidade)}</span>
                </div>
              ))}
            </div>
            {p.observacao && <p className="text-[12px] text-[#999] italic mb-3">{p.observacao}</p>}
            <div className="flex flex-wrap gap-2">
              {p.status !== "cancelado" && p.status !== "entregue" && (
                <select value={p.status} onChange={e => mudarStatus(p.id, e.target.value as Pedido["status"])} className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] outline-none bg-white cursor-pointer">
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              )}
              {p.whatsapp && (
                <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[12px] text-green-600 hover:text-green-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-lg">
                  WhatsApp
                </a>
              )}
              <button onClick={() => removerPedido(p.id)} className="text-[12px] text-red-400 hover:text-red-600 px-3 py-1.5">Excluir</button>
            </div>
          </div>
        ))}
        {filtrados.length === 0 && <p className="text-center text-[#999] py-12 text-[13px]">Nenhum pedido {filtroStatus !== "todos" ? `com status "${statusLabels[filtroStatus]}"` : "registrado"}.</p>}
      </div>
    </div>
  );
}

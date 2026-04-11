"use client";

import { useLoja } from "@/context/LojaContext";
import { useState, useEffect } from "react";

function formatarPreco(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

export default function AdminRelatorios() {
  const { produtos } = useLoja();
  const [pedidos, setPedidos] = useState<{ total: number; status: string; data: string; itens: { produtoId: string; nome: string; quantidade: number; preco: number }[] }[]>([]);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("loja_pedidos");
      if (salvo) setPedidos(JSON.parse(salvo));
    } catch {}
  }, []);

  const pedidosValidos = pedidos.filter(p => p.status !== "cancelado");
  const receitaTotal = pedidosValidos.reduce((acc, p) => acc + p.total, 0);
  const ticketMedio = pedidosValidos.length > 0 ? receitaTotal / pedidosValidos.length : 0;
  const totalItensVendidos = pedidosValidos.reduce((acc, p) => acc + p.itens.reduce((a, i) => a + i.quantidade, 0), 0);

  // Produtos mais vendidos
  const vendasPorProduto: Record<string, { nome: string; qtd: number; receita: number }> = {};
  pedidosValidos.forEach(p => {
    p.itens.forEach(i => {
      if (!vendasPorProduto[i.produtoId]) vendasPorProduto[i.produtoId] = { nome: i.nome, qtd: 0, receita: 0 };
      vendasPorProduto[i.produtoId].qtd += i.quantidade;
      vendasPorProduto[i.produtoId].receita += i.preco * i.quantidade;
    });
  });
  const topProdutos = Object.entries(vendasPorProduto).sort((a, b) => b[1].qtd - a[1].qtd).slice(0, 10);

  // Vendas por categoria
  const vendasPorCategoria: Record<string, number> = {};
  pedidosValidos.forEach(p => {
    p.itens.forEach(i => {
      const prod = produtos.find(x => x.id === i.produtoId);
      const cat = prod?.categoria || "Outros";
      vendasPorCategoria[cat] = (vendasPorCategoria[cat] || 0) + i.quantidade;
    });
  });
  const maxCatVendas = Math.max(...Object.values(vendasPorCategoria), 1);

  // Valor do estoque por categoria
  const estoquePorCategoria: Record<string, { qtd: number; valor: number }> = {};
  produtos.forEach(p => {
    if (!estoquePorCategoria[p.categoria]) estoquePorCategoria[p.categoria] = { qtd: 0, valor: 0 };
    estoquePorCategoria[p.categoria].qtd += p.estoque;
    estoquePorCategoria[p.categoria].valor += (p.precoPromocional ?? p.preco) * p.estoque;
  });

  // Media de avaliação por categoria
  const avaliacaoPorCategoria: Record<string, { total: number; qtd: number }> = {};
  produtos.forEach(p => {
    if (p.nota) {
      if (!avaliacaoPorCategoria[p.categoria]) avaliacaoPorCategoria[p.categoria] = { total: 0, qtd: 0 };
      avaliacaoPorCategoria[p.categoria].total += p.nota;
      avaliacaoPorCategoria[p.categoria].qtd += 1;
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Relatórios</h1>
      <p className="text-[13px] text-[#999] mb-8">Analise o desempenho da sua loja</p>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[12px] text-[#999]">Receita Total</p>
          <p className="text-2xl font-bold text-[#1B3A5C] mt-1">{formatarPreco(receitaTotal)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[12px] text-[#999]">Pedidos</p>
          <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{pedidosValidos.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[12px] text-[#999]">Ticket Medio</p>
          <p className="text-2xl font-bold text-[#D4A843] mt-1">{formatarPreco(ticketMedio)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[12px] text-[#999]">Itens Vendidos</p>
          <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{totalItensVendidos}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Top Produtos */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Produtos Mais Vendidos</h2>
          {topProdutos.length > 0 ? topProdutos.map(([id, data], i) => (
            <div key={id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <span className="w-6 h-6 rounded-full bg-[#FBF8F3] flex items-center justify-center text-[10px] font-bold text-[#D4A843]">{i+1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1a1a2e] truncate">{data.nome}</p>
                <p className="text-[11px] text-[#999]">{data.qtd} vendidos — {formatarPreco(data.receita)}</p>
              </div>
            </div>
          )) : <p className="text-[13px] text-[#999] text-center py-6">Registre pedidos para ver os mais vendidos</p>}
        </div>

        {/* Vendas por Categoria */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Vendas por Categoria</h2>
          {Object.keys(vendasPorCategoria).length > 0 ? Object.entries(vendasPorCategoria).sort((a,b) => b[1] - a[1]).map(([cat, qtd]) => (
            <div key={cat} className="mb-3">
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-[#1a1a2e]">{cat}</span>
                <span className="text-[#999]">{qtd} un.</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1B3A5C] rounded-full transition-all" style={{ width: `${(qtd / maxCatVendas) * 100}%` }} />
              </div>
            </div>
          )) : <p className="text-[13px] text-[#999] text-center py-6">Registre pedidos para ver estatísticas</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Estoque por Categoria */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Estoque por Categoria</h2>
          {Object.entries(estoquePorCategoria).map(([cat, data]) => (
            <div key={cat} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-[13px] text-[#1a1a2e]">{cat}</span>
              <div className="text-right">
                <span className="text-[13px] font-medium text-[#1a1a2e]">{data.qtd} un.</span>
                <span className="text-[11px] text-[#999] ml-2">{formatarPreco(data.valor)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Avaliação por Categoria */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Avaliação por Categoria</h2>
          {Object.entries(avaliacaoPorCategoria).sort((a,b) => (b[1].total/b[1].qtd) - (a[1].total/a[1].qtd)).map(([cat, data]) => {
            const media = data.total / data.qtd;
            return (
              <div key={cat} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-[13px] text-[#1a1a2e]">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <svg key={i} className={`w-3 h-3 ${i <= Math.round(media) ? "text-[#D4A843]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" /></svg>)}</div>
                  <span className="text-[13px] font-bold text-[#D4A843]">{media.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useLoja } from "@/context/LojaContext";
import { useFinanceiro } from "@/context/FinanceiroContext";
import Link from "next/link";

function F(v: number) { return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function AdminDashboard() {
  const { produtos, banners, cupons } = useLoja();
  const { transacoes, contas, getSaldo } = useFinanceiro();

  const totalProdutos = produtos.length;
  const emEstoque = produtos.filter(p => p.estoque > 0).length;
  const esgotados = produtos.filter(p => p.estoque === 0).length;
  const baixoEstoque = produtos.filter(p => p.estoque > 0 && p.estoque <= 5).length;
  const emPromocao = produtos.filter(p => p.precoPromocional).length;
  const totalAvaliacoes = produtos.reduce((acc, p) => acc + (p.avaliacoes?.length || 0), 0);

  const now = new Date();
  const mesAtual = transacoes.filter(t => { const d = new Date(t.data + "T12:00:00"); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const receitaMes = mesAtual.filter(t => t.tipo === "Receita").reduce((s, t) => s + t.qtd * t.valorUn, 0);
  const despesaMes = mesAtual.filter(t => t.tipo === "Despesa").reduce((s, t) => s + t.qtd * t.valorUn, 0);
  const saldo = getSaldo();
  const contasVencidas = contas.filter(c => !c.pago && c.vencimento < now.toISOString().split("T")[0]).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Dashboard</h1>
          <p className="text-[13px] text-[#999] mt-1">Visão geral da loja e finanças</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/produtos/novo" className="bg-[#1B3A5C] text-white px-4 py-2 text-[12px] font-medium rounded-lg hover:bg-[#243F6B]">+ Produto</Link>
          <Link href="/admin/financeiro/lancamento" className="bg-[#D4A843] text-white px-4 py-2 text-[12px] font-medium rounded-lg hover:bg-[#C49A30]">+ Lançamento</Link>
        </div>
      </div>

      {/* Financeiro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link href="/admin/financeiro" className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-[#D4A843] hover:shadow-sm transition-shadow">
          <p className="text-[11px] font-semibold text-[#999] uppercase">Saldo</p>
          <p className={`text-2xl font-bold mt-1 ${saldo >= 0 ? "text-[#D4A843]" : "text-red-500"}`}>{F(saldo)}</p>
        </Link>
        <Link href="/admin/financeiro" className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-green-500 hover:shadow-sm transition-shadow">
          <p className="text-[11px] font-semibold text-[#999] uppercase">Receita (Mês)</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{F(receitaMes)}</p>
        </Link>
        <Link href="/admin/financeiro" className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-red-500 hover:shadow-sm transition-shadow">
          <p className="text-[11px] font-semibold text-[#999] uppercase">Despesas (Mês)</p>
          <p className="text-2xl font-bold mt-1 text-red-500">{F(despesaMes)}</p>
        </Link>
        <Link href="/admin/financeiro" className="bg-white rounded-xl p-5 border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-sm transition-shadow">
          <p className="text-[11px] font-semibold text-[#999] uppercase">Lucro (Mês)</p>
          <p className={`text-2xl font-bold mt-1 ${receitaMes - despesaMes >= 0 ? "text-blue-600" : "text-red-500"}`}>{F(receitaMes - despesaMes)}</p>
        </Link>
      </div>

      {/* Loja */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Produtos", valor: totalProdutos, cor: "text-[#1a1a2e]", href: "/admin/produtos" },
          { label: "Em Estoque", valor: emEstoque, cor: "text-green-600", href: "/admin/estoque" },
          { label: "Baixo Estoque", valor: baixoEstoque, cor: "text-amber-500", href: "/admin/estoque" },
          { label: "Em Promoção", valor: emPromocao, cor: "text-purple-600", href: "/admin/produtos" },
          { label: "Avaliações", valor: totalAvaliacoes, cor: "text-[#D4A843]", href: "/admin/avaliacoes" },
        ].map(s => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow text-center">
            <p className={`text-2xl font-bold ${s.cor}`}>{s.valor}</p>
            <p className="text-[10px] text-[#999] uppercase tracking-wider font-semibold mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Novo Pedido", href: "/admin/pedidos", icon: "🛒" },
          { label: "Novo Cupom", href: "/admin/cupons", icon: "🏷️" },
          { label: "Banners", href: "/admin/banners", icon: "🖼️" },
          { label: "Configurações", href: "/admin/configuracoes", icon: "⚙️" },
        ].map(a => (
          <Link key={a.label} href={a.href} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#D4A843] hover:shadow-sm transition-all flex items-center gap-3">
            <span className="text-xl">{a.icon}</span>
            <span className="text-[13px] font-medium text-[#1a1a2e]">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Alertas */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Alertas</h2>
          {esgotados > 0 && <div className="flex items-center gap-2 text-[13px] py-2 border-b border-gray-50"><span>🔴</span><span>{esgotados} produto(s) esgotado(s)</span><Link href="/admin/estoque" className="text-[#D4A843] ml-auto text-[12px]">Ver →</Link></div>}
          {baixoEstoque > 0 && <div className="flex items-center gap-2 text-[13px] py-2 border-b border-gray-50"><span>🟡</span><span>{baixoEstoque} com estoque baixo</span><Link href="/admin/estoque" className="text-[#D4A843] ml-auto text-[12px]">Ver →</Link></div>}
          {contasVencidas > 0 && <div className="flex items-center gap-2 text-[13px] py-2 border-b border-gray-50"><span>💰</span><span>{contasVencidas} conta(s) vencida(s)</span><Link href="/admin/financeiro/contas" className="text-[#D4A843] ml-auto text-[12px]">Ver →</Link></div>}
          {esgotados === 0 && baixoEstoque === 0 && contasVencidas === 0 && <p className="text-[13px] text-green-600">✅ Tudo em ordem!</p>}
        </div>

        {/* Mais avaliados */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Mais Avaliados</h2>
          {[...produtos].sort((a, b) => (b.nota ?? 0) - (a.nota ?? 0)).slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-[13px]">{p.nome}</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-[#D4A843]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" /></svg>
                <span className="text-[13px] font-bold text-[#D4A843]">{p.nota?.toFixed(1)}</span>
                <span className="text-[11px] text-[#999]">({p.avaliacoes?.length})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

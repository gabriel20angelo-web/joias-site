"use client";

import { useLoja } from "@/context/LojaContext";
import { useState, useMemo } from "react";
import Link from "next/link";

type FiltroStatus = "todos" | "disponivel" | "baixo" | "esgotado";
type Ordenacao = "nome" | "estoque-asc" | "estoque-desc" | "categoria";

interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  produtoNome: string;
  tipo: "entrada" | "saida" | "ajuste";
  quantidade: number;
  estoqueAnterior: number;
  estoqueNovo: number;
  data: string;
}

export default function AdminEstoque() {
  const { produtos, atualizarProduto } = useLoja();
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("nome");
  const [busca, setBusca] = useState("");
  const [alertaMinimo, setAlertaMinimo] = useState(5);
  const [ajusteRapido, setAjusteRapido] = useState<Record<string, string>>({});
  const [historico, setHistorico] = useState<MovimentacaoEstoque[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const salvo = localStorage.getItem("estoque_historico");
        return salvo ? JSON.parse(salvo) : [];
      } catch { return []; }
    }
    return [];
  });

  function salvarHistorico(novoHistorico: MovimentacaoEstoque[]) {
    setHistorico(novoHistorico);
    localStorage.setItem("estoque_historico", JSON.stringify(novoHistorico.slice(0, 100)));
  }

  function registrarMovimentacao(produtoId: string, produtoNome: string, tipo: "entrada" | "saida" | "ajuste", quantidade: number, estoqueAnterior: number, estoqueNovo: number) {
    const mov: MovimentacaoEstoque = {
      id: Date.now().toString(36),
      produtoId, produtoNome, tipo, quantidade, estoqueAnterior, estoqueNovo,
      data: new Date().toISOString(),
    };
    salvarHistorico([mov, ...historico]);
  }

  function ajustarEstoque(id: string, delta: number) {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;
    const novoEstoque = Math.max(0, produto.estoque + delta);
    atualizarProduto(id, { estoque: novoEstoque });
    registrarMovimentacao(id, produto.nome, delta > 0 ? "entrada" : "saida", Math.abs(delta), produto.estoque, novoEstoque);
  }

  function definirEstoque(id: string) {
    const valor = ajusteRapido[id];
    if (valor === undefined || valor === "") return;
    const novoEstoque = Math.max(0, parseInt(valor));
    if (isNaN(novoEstoque)) return;
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;
    atualizarProduto(id, { estoque: novoEstoque });
    registrarMovimentacao(id, produto.nome, "ajuste", novoEstoque - produto.estoque, produto.estoque, novoEstoque);
    setAjusteRapido({ ...ajusteRapido, [id]: "" });
  }

  const filtrados = useMemo(() => {
    let resultado = produtos.filter((p) => {
      if (busca && !p.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      if (filtro === "disponivel") return p.estoque > alertaMinimo;
      if (filtro === "baixo") return p.estoque > 0 && p.estoque <= alertaMinimo;
      if (filtro === "esgotado") return p.estoque === 0;
      return true;
    });

    switch (ordenacao) {
      case "nome": resultado.sort((a, b) => a.nome.localeCompare(b.nome)); break;
      case "estoque-asc": resultado.sort((a, b) => a.estoque - b.estoque); break;
      case "estoque-desc": resultado.sort((a, b) => b.estoque - a.estoque); break;
      case "categoria": resultado.sort((a, b) => a.categoria.localeCompare(b.categoria)); break;
    }
    return resultado;
  }, [produtos, filtro, ordenacao, busca, alertaMinimo]);

  const totalEstoque = produtos.reduce((acc, p) => acc + p.estoque, 0);
  const esgotados = produtos.filter((p) => p.estoque === 0).length;
  const baixoEstoque = produtos.filter((p) => p.estoque > 0 && p.estoque <= alertaMinimo).length;
  const valorEstoque = produtos.reduce((acc, p) => acc + (p.precoPromocional ?? p.preco) * p.estoque, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Controle de Estoque</h1>
          <p className="text-[13px] text-[#999] mt-1">Gerencie o estoque de todos os produtos</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-[#999]">Alerta minimo:</label>
          <input
            type="number"
            min="1"
            max="50"
            value={alertaMinimo}
            onChange={(e) => setAlertaMinimo(parseInt(e.target.value) || 5)}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] text-center outline-none focus:border-[#D4A843]"
          />
          <span className="text-[12px] text-[#999]">un.</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[12px] text-[#999] font-medium">Total em Estoque</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{totalEstoque}</p>
          <p className="text-[11px] text-[#999] mt-1">unidades</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-[12px] text-[#999] font-medium">Valor do Estoque</p>
          <p className="text-2xl font-bold text-[#1B3A5C] mt-1">{valorEstoque.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          <p className="text-[11px] text-[#999] mt-1">a preco de venda</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
          <p className="text-[12px] text-amber-700 font-medium">Estoque Baixo</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">{baixoEstoque}</p>
          <p className="text-[11px] text-amber-600/70 mt-1">abaixo de {alertaMinimo} un.</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-100">
          <p className="text-[12px] text-red-700 font-medium">Esgotados</p>
          <p className="text-3xl font-bold text-red-700 mt-1">{esgotados}</p>
          <p className="text-[11px] text-red-600/70 mt-1">produtos sem estoque</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 min-w-[180px] border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#D4A843]"
        />
        <div className="flex gap-1">
          {([
            { value: "todos", label: "Todos", count: produtos.length },
            { value: "disponivel", label: "Disponivel", count: produtos.filter((p) => p.estoque > alertaMinimo).length },
            { value: "baixo", label: "Baixo", count: baixoEstoque },
            { value: "esgotado", label: "Esgotado", count: esgotados },
          ] as const).map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
                filtro === f.value ? "bg-[#1B3A5C] text-white" : "bg-gray-100 text-[#666] hover:bg-gray-200"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none bg-white cursor-pointer"
        >
          <option value="nome">Nome A-Z</option>
          <option value="estoque-asc">Menor estoque</option>
          <option value="estoque-desc">Maior estoque</option>
          <option value="categoria">Categoria</option>
        </select>
      </div>

      {/* Tabela de Estoque */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Produto</th>
                <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-left">Categoria</th>
                <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-center">Estoque Atual</th>
                <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-center">Ajuste Rápido</th>
                <th className="px-4 py-3 font-medium text-[#999] text-[11px] uppercase tracking-wider text-center">Definir</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const status = p.estoque === 0 ? "esgotado" : p.estoque <= alertaMinimo ? "baixo" : "ok";
                return (
                  <tr key={p.id} className={`border-t border-gray-50 hover:bg-gray-50/50 ${status === "esgotado" ? "bg-red-50/30" : status === "baixo" ? "bg-amber-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-[#FBF8F3] rounded flex items-center justify-center text-sm shrink-0">💎</div>
                        <div>
                          <Link href={`/admin/produtos/${p.id}`} className="font-medium text-[#1a1a2e] hover:text-[#D4A843] transition-colors">{p.nome}</Link>
                          <p className="text-[10px] text-[#999]">{p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#666]">{p.categoria}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        status === "esgotado" ? "bg-red-100 text-red-700" :
                        status === "baixo" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          status === "esgotado" ? "bg-red-500" :
                          status === "baixo" ? "bg-amber-500 animate-pulse" :
                          "bg-green-500"
                        }`} />
                        {status === "esgotado" ? "Esgotado" : status === "baixo" ? "Baixo" : "Disponivel"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <span className={`text-[20px] font-bold tabular-nums ${
                          status === "esgotado" ? "text-red-600" :
                          status === "baixo" ? "text-amber-600" :
                          "text-[#1a1a2e]"
                        }`}>
                          {p.estoque}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => ajustarEstoque(p.id, -10)}
                          className="w-7 h-7 rounded bg-gray-100 text-[#666] hover:bg-red-100 hover:text-red-600 text-[10px] font-bold transition-colors"
                          title="-10"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => ajustarEstoque(p.id, -1)}
                          className="w-7 h-7 rounded bg-gray-100 text-[#666] hover:bg-red-100 hover:text-red-600 text-[14px] font-bold transition-colors"
                          title="-1"
                        >
                          -
                        </button>
                        <button
                          onClick={() => ajustarEstoque(p.id, 1)}
                          className="w-7 h-7 rounded bg-gray-100 text-[#666] hover:bg-green-100 hover:text-green-600 text-[14px] font-bold transition-colors"
                          title="+1"
                        >
                          +
                        </button>
                        <button
                          onClick={() => ajustarEstoque(p.id, 10)}
                          className="w-7 h-7 rounded bg-gray-100 text-[#666] hover:bg-green-100 hover:text-green-600 text-[10px] font-bold transition-colors"
                          title="+10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={ajusteRapido[p.id] || ""}
                          onChange={(e) => setAjusteRapido({ ...ajusteRapido, [p.id]: e.target.value })}
                          onKeyDown={(e) => e.key === "Enter" && definirEstoque(p.id)}
                          placeholder={p.estoque.toString()}
                          className="w-16 border border-gray-200 rounded px-2 py-1 text-[12px] text-center outline-none focus:border-[#D4A843]"
                        />
                        <button
                          onClick={() => definirEstoque(p.id)}
                          disabled={!ajusteRapido[p.id]}
                          className="px-2 py-1 bg-[#1B3A5C] text-white rounded text-[10px] font-medium hover:bg-[#243F6B] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          OK
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtrados.length === 0 && <p className="text-center text-[#999] py-12 text-[13px]">Nenhum produto encontrado.</p>}
      </div>

      {/* Histórico de Movimentações */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-[#1a1a2e]">Histórico de Movimentações</h2>
          {historico.length > 0 && (
            <button
              onClick={() => { salvarHistorico([]); }}
              className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
            >
              Limpar histórico
            </button>
          )}
        </div>

        {historico.length === 0 ? (
          <p className="text-[13px] text-[#999] text-center py-8">Nenhuma movimentação registrada ainda. Ajuste o estoque de um produto para começar.</p>
        ) : (
          <div className="space-y-0 max-h-[400px] overflow-y-auto">
            {historico.slice(0, 50).map((mov) => (
              <div key={mov.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  mov.tipo === "entrada" ? "bg-green-100 text-green-600" :
                  mov.tipo === "saida" ? "bg-red-100 text-red-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {mov.tipo === "entrada" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    ) : mov.tipo === "saida" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    )}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#1a1a2e]">
                    <span className="font-medium">{mov.produtoNome}</span>
                    {" — "}
                    <span className={mov.tipo === "entrada" ? "text-green-600" : mov.tipo === "saida" ? "text-red-600" : "text-blue-600"}>
                      {mov.tipo === "entrada" ? `+${mov.quantidade} entrada` :
                       mov.tipo === "saida" ? `-${Math.abs(mov.quantidade)} saida` :
                       `ajuste para ${mov.estoqueNovo}`}
                    </span>
                  </p>
                  <p className="text-[11px] text-[#999]">
                    {mov.estoqueAnterior} → {mov.estoqueNovo} un. — {new Date(mov.data).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

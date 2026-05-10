"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CardProduto from "@/components/CardProduto";
import { useLoja } from "@/context/LojaContext";
import AnimacaoScroll from "@/components/AnimacaoScroll";
import Breadcrumb from "@/components/Breadcrumb";

type Ordenacao = "relevância" | "menor-preco" | "maior-preco" | "mais-avaliados" | "novidades";

export default function Catalogo() {
  return (
    <Suspense>
      <CatalogoInner />
    </Suspense>
  );
}

function CatalogoInner() {
  const { produtos } = useLoja();
  const categorias = ["Todas", ...new Set(produtos.map((p) => p.categoria))];
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(catParam || "Todas");
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("relevância");
  const [faixaPreco, setFaixaPreco] = useState<[number, number]>([0, 500]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const filtrados = useMemo(() => {
    let resultado = categoriaSelecionada === "Todas"
      ? [...produtos]
      : produtos.filter((p) => p.categoria === categoriaSelecionada);

    // Busca por texto
    if (busca.trim()) {
      const q = busca.toLowerCase();
      resultado = resultado.filter(p => p.nome.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q));
    }

    resultado = resultado.filter((p) => {
      const preco = p.precoPromocional ?? p.preco;
      return preco >= faixaPreco[0] && preco <= faixaPreco[1];
    });

    switch (ordenacao) {
      case "menor-preco":
        resultado.sort((a, b) => (a.precoPromocional ?? a.preco) - (b.precoPromocional ?? b.preco));
        break;
      case "maior-preco":
        resultado.sort((a, b) => (b.precoPromocional ?? b.preco) - (a.precoPromocional ?? a.preco));
        break;
      case "mais-avaliados":
        resultado.sort((a, b) => (b.nota ?? 0) - (a.nota ?? 0));
        break;
      case "novidades":
        resultado.sort((a, b) => (b.novo ? 1 : 0) - (a.novo ? 1 : 0));
        break;
    }

    return resultado;
  }, [categoriaSelecionada, ordenacao, faixaPreco]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Titulo */}
      <div className="text-center mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-3 font-medium">
          Explore
        </p>
        <h1 className="text-3xl md:text-5xl text-[#1a1a2e] tracking-[0.03em]">
          Catálogo
        </h1>
      </div>

      <Breadcrumb itens={[{ label: "Catálogo" }]} />

      {/* Busca */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou descrição..." className="w-full border border-gray-200 rounded-full pl-11 pr-4 py-3 text-[14px] outline-none focus:border-[#D4A843] transition-colors" />
          {busca && <button onClick={() => setBusca("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#999]">×</button>}
        </div>
      </div>

      {/* Filtros de categoria */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSelecionada(cat)}
            className={`px-5 py-2 text-[12px] uppercase tracking-[0.1em] transition-all duration-300 ${
              categoriaSelecionada === cat
                ? "bg-[#1B3A5C] text-white"
                : "bg-transparent text-[#666] hover:text-[#1a1a2e] border border-[#ddd] hover:border-[#1a1a2e]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Barra de ordenacao e filtros */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <p className="text-[12px] text-[#999] font-light">
          {filtrados.length} {filtrados.length === 1 ? "produto" : "produtos"}
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-[#666] hover:text-[#1a1a2e] transition-colors md:hidden"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filtros
          </button>

          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
            className="text-[12px] text-[#666] font-light border border-[#ddd] px-4 py-2 bg-white outline-none cursor-pointer hover:border-[#1a1a2e] transition-colors"
          >
            <option value="relevância">Relevância</option>
            <option value="menor-preco">Menor preco</option>
            <option value="maior-preco">Maior preco</option>
            <option value="mais-avaliados">Mais avaliados</option>
            <option value="novidades">Novidades</option>
          </select>
        </div>
      </div>

      {/* Filtro de preco (expansivel) */}
      <div className={`overflow-hidden transition-all duration-300 ${mostrarFiltros || "hidden md:block"}`}>
        <div className="mb-8 flex items-center gap-6 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#999] font-medium">Preco:</span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={faixaPreco[1]}
              onChange={(e) => setFaixaPreco([0, Number(e.target.value)])}
              className="w-40 accent-[#D4A843]"
            />
            <span className="text-[12px] text-[#666] font-light min-w-[100px]">
              Até R$ {faixaPreco[1].toFixed(0)}
            </span>
          </div>
          {faixaPreco[1] < 500 && (
            <button
              onClick={() => setFaixaPreco([0, 500])}
              className="text-[11px] text-[#D4A843] hover:text-[#1a1a2e] transition-colors font-light"
            >
              Limpar filtro
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {filtrados.map((produto, i) => (
          <AnimacaoScroll key={produto.id} delay={(i % 4) * 80}>
            <CardProduto produto={produto} />
          </AnimacaoScroll>
        ))}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-20">
          <span className="text-4xl opacity-30 block mb-4">🔍</span>
          <p className="text-[14px] text-[#999] font-light mb-2">
            Nenhum produto encontrado.
          </p>
          <button
            onClick={() => { setCategoriaSelecionada("Todas"); setFaixaPreco([0, 500]); }}
            className="text-[12px] text-[#D4A843] hover:text-[#1a1a2e] transition-colors font-light"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useLoja } from "@/context/LojaContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import GaleriaProduto from "@/components/GaleriaProduto";
import BotaoCarrinho from "@/components/BotaoCarrinho";
import CalculoFrete from "@/components/CalculoFrete";
import Estrelas from "@/components/Estrelas";
import Avaliacoes from "@/components/Avaliacoes";
import CarrosselProdutos from "@/components/CarrosselProdutos";
import Compartilhar from "@/components/Compartilhar";
import AbasProduto from "@/components/AbasProduto";
import CompreJunto from "@/components/CompreJunto";
import BarraMobileCompra from "@/components/BarraMobileCompra";
import VistoRecentemente, { registrarVisualizacao } from "@/components/VistoRecentemente";
import Countdown from "@/components/Countdown";
import GuiaTamanhos from "@/components/GuiaTamanhos";
import { useEffect } from "react";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProdutoPage() {
  const { produtos, config } = useLoja();
  const params = useParams();
  const id = params.id as string;
  const produto = produtos.find((p) => p.id === id);

  useEffect(() => {
    if (id) registrarVisualizacao(id);
  }, [id]);

  if (!produto) return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
      <p className="text-[#999] text-[14px]">Produto não encontrado.</p>
      <Link href="/catalogo" className="text-[#D4A843] text-[13px] mt-4 inline-block">Voltar ao catálogo</Link>
    </div>
  );

  const precoFinal = produto.precoPromocional ?? produto.preco;
  const parcelas = Math.min(config.maxParcelas, Math.floor(precoFinal / 20));
  const desconto = produto.precoPromocional
    ? Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)
    : 0;

  const relacionados = produtos.filter(
    (p) => p.categoria === produto.categoria && p.id !== produto.id
  );
  const sugestões = relacionados.length > 0
    ? relacionados
    : produtos.filter((p) => p.id !== produto.id).slice(0, 4);

  const mensagemWhatsApp = encodeURIComponent(
    `Ola! Tenho interesse na peca: ${produto.nome} (${formatarPreco(precoFinal)})`
  );

  const nomesCores: Record<string, string> = {
    "#D4AF37": "Dourado",
    "#C0C0C0": "Prata",
    "#E8C4C4": "Rose",
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#999] mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#1a1a2e] transition-colors duration-300">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-[#1a1a2e] transition-colors duration-300">Catálogo</Link>
        <span>/</span>
        <Link href={`/catalogo?cat=${produto.categoria}`} className="hover:text-[#1a1a2e] transition-colors duration-300">{produto.categoria}</Link>
        <span>/</span>
        <span className="text-[#1a1a2e]">{produto.nome}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Galeria */}
        <GaleriaProduto imagens={produto.imagens} />

        {/* Info */}
        <div className="py-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#D4A843] mb-3 font-medium">
            {produto.categoria}
          </p>
          <h1 className="text-3xl md:text-4xl text-[#1a1a2e] tracking-[0.03em] mb-4">
            {produto.nome}
          </h1>

          {/* Estrelas */}
          {produto.nota && (
            <div className="mb-6">
              <Estrelas nota={produto.nota} total={produto.avaliacoes?.length} />
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-2">
            {produto.precoPromocional ? (
              <>
                <span className="text-[#999] line-through text-[15px]">
                  {formatarPreco(produto.preco)}
                </span>
                <span className="text-[26px] font-semibold text-[#1a1a2e]">
                  {formatarPreco(produto.precoPromocional)}
                </span>
                <span className="text-[12px] bg-[#c44] text-white px-2 py-0.5 font-medium">
                  -{desconto}%
                </span>
              </>
            ) : (
              <span className="text-[26px] font-semibold text-[#1a1a2e]">
                {formatarPreco(produto.preco)}
              </span>
            )}
          </div>

          {parcelas > 1 && (
            <p className="text-[13px] text-[#999] font-light mb-4">
              ou {parcelas}x de {formatarPreco(precoFinal / parcelas)} sem juros
            </p>
          )}

          {/* Countdown para promocoes */}
          {produto.precoPromocional && (
            <div className="mb-6">
              <Countdown label="Oferta encerra em:" />
            </div>
          )}

          <p className="text-[15px] text-[#666] leading-relaxed mb-6">
            {produto.descricao}
          </p>

          {/* Cores */}
          {produto.cores && produto.cores.length > 0 && (
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[#999] font-medium block mb-2">Cor</span>
              <div className="flex gap-2">
                {produto.cores.map((cor, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${i === 0 ? "border-[#1a1a2e]" : "border-gray-200 hover:border-[#999]"}`}
                    style={{ backgroundColor: cor }}
                    title={nomesCores[cor] || cor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Guia de tamanhos */}
          {(produto.categoria === "Anéis" || produto.categoria === "Pulseiras") && (
            <div className="mb-6">
              <GuiaTamanhos tipo={produto.categoria === "Anéis" ? "anel" : "pulseira"} />
            </div>
          )}

          {/* Info rápidas */}
          <div className="flex flex-wrap gap-4 mb-6 text-[12px] text-[#666] font-light">
            {produto.material && (
              <span className="flex items-center gap-1.5 bg-[#FBF8F3] px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-[#D4A843]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                {produto.material}
              </span>
            )}
            {produto.peso && (
              <span className="flex items-center gap-1.5 bg-[#FBF8F3] px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-[#D4A843]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
                {produto.peso}
              </span>
            )}
          </div>

          <div className="mb-6">
            {produto.estoque > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1B3A5C] animate-pulse" />
                <span className="text-[13px] text-[#1B3A5C] font-light">
                  Em estoque — {produto.estoque} disponíveis
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#c44]" />
                <span className="text-[13px] text-[#c44] font-light">Esgotado</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <BotaoCarrinho produto={produto} />
            <a
              href={`https://wa.me/${config.whatsapp}?text=${mensagemWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#1a1a2e] text-[#1a1a2e] text-center py-3.5 text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[#1a1a2e] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Comprar pelo WhatsApp
            </a>
          </div>

          {/* Beneficios inline */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            {[
              { icone: "🚚", texto: `Frete grátis acima de R$${config.freteGratisMinimo}` },
              { icone: "💳", texto: `Parcele em até ${config.maxParcelas}x sem juros` },
              { icone: "🔄", texto: "Troca garantida em até 7 dias" },
              { icone: "🔒", texto: "Pagamento 100% seguro" },
            ].map((b) => (
              <div key={b.texto} className="flex items-center gap-3">
                <span className="text-sm">{b.icone}</span>
                <span className="text-[12px] text-[#666] font-light">{b.texto}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <CalculoFrete />
          </div>

          {/* Compartilhar */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Compartilhar nome={produto.nome} url={typeof window !== "undefined" ? `${window.location.origin}/produto/${produto.id}` : `/produto/${produto.id}`} />
          </div>

          {/* Compre Junto */}
          <CompreJunto principal={produto} sugestões={sugestões.slice(0, 1)} />
        </div>
      </div>

      {/* Abas: Descrição / Especificações / Avaliações */}
      <AbasProduto abas={[
        {
          id: "descricao",
          titulo: "Descrição",
          conteudo: produto.descricaoCompleta ? (
            <div className="max-w-3xl text-[15px] text-[#666] leading-relaxed space-y-4">
              {produto.descricaoCompleta.split("\n\n").map((p, i) => (
                <div key={i}>
                  {p.startsWith("**") ? (
                    <h3 className="text-[13px] font-medium text-[#1a1a2e] mt-6 mb-2">
                      {p.replace(/\*\*/g, "")}
                    </h3>
                  ) : p.startsWith("- ") ? (
                    <ul className="list-none space-y-1.5 ml-1">
                      {p.split("\n").map((line, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-[#D4A843] mt-0.5">•</span>
                          <span>{line.replace("- ", "")}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{p}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-[#666]">{produto.descricao}</p>
          ),
        },
        {
          id: "especificações",
          titulo: "Especificações",
          conteudo: (
            <div className="max-w-lg">
              <table className="w-full text-[13px]">
                <tbody>
                  {[
                    ["Categoria", produto.categoria],
                    ["Material", produto.material || "-"],
                    ["Peso", produto.peso || "-"],
                    ["Cores disponíveis", produto.cores?.map(c => nomesCores[c] || c).join(", ") || "-"],
                    ["Garantia", "6 meses contra defeitos"],
                    ["Codigo", `#JOI-${produto.id.padStart(4, "0")}`],
                  ].map(([label, value], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[#FBF8F3]" : ""}>
                      <td className="py-3 px-4 font-medium text-[#1a1a2e]">{label}</td>
                      <td className="py-3 px-4 font-light text-[#666]">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: "avaliacoes",
          titulo: `Avaliacoes (${produto.avaliacoes?.length || 0})`,
          conteudo: produto.avaliacoes && produto.nota ? (
            <Avaliacoes avaliacoes={produto.avaliacoes} nota={produto.nota} />
          ) : (
            <p className="text-[15px] text-[#999] py-8 text-center">Nenhuma avaliação ainda.</p>
          ),
        },
      ]} />

      {/* Produtos Relacionados */}
      {sugestões.length > 0 && (
        <section className="border-t border-gray-100 pt-12 mt-12 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e]">
              Você também pode gostar
            </h2>
            <Link
              href="/catalogo"
              className="text-[12px] uppercase tracking-[0.1em] text-[#D4A843] hover:text-[#1a1a2e] transition-colors duration-300 font-light"
            >
              Ver mais
            </Link>
          </div>
          <CarrosselProdutos produtos={sugestões} id="relacionados" />
        </section>
      )}

      {/* Vistos recentemente */}
      <VistoRecentemente excluirId={produto.id} />

      {/* Barra mobile sticky */}
      <BarraMobileCompra produto={produto} />
    </div>
  );
}

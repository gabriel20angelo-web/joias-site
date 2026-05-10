"use client";

import { useCarrinho } from "@/context/CarrinhoContext";
import { useLoja } from "@/context/LojaContext";
import CalculoFrete from "@/components/CalculoFrete";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { useState } from "react";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CarrinhoPage() {
  const {
    itens,
    remover,
    alterarQuantidade,
    limpar,
    cupom,
    aplicarCupom,
    removerCupom,
    desconto,
    subtotal,
    total,
  } = useCarrinho();
  const { config } = useLoja();
  const FRETE_GRATIS_MINIMO = config.freteGratisMinimo;

  const [inputCupom, setInputCupom] = useState("");
  const [erroCupom, setErroCupom] = useState("");
  const [presente, setPresente] = useState(false);
  const [msgPresente, setMsgPresente] = useState("");

  const progressoFrete = Math.min(100, (subtotal / FRETE_GRATIS_MINIMO) * 100);
  const faltaParaFrete = Math.max(0, FRETE_GRATIS_MINIMO - subtotal);

  function handleCupom() {
    setErroCupom("");
    if (!aplicarCupom(inputCupom)) {
      setErroCupom("Cupom inválido.");
    }
    setInputCupom("");
  }

  if (itens.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
        <svg className="w-12 h-12 mx-auto text-[#ddd] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <h1 className="text-2xl font-medium text-[#1a1a2e] tracking-[0.03em] mb-4">
          Seu carrinho está vazio
        </h1>
        <p className="text-[14px] text-[#999] font-light mb-10">
          Explore nosso catálogo e encontre a peça perfeita.
        </p>
        <Link
          href="/catalogo"
          className="inline-block bg-[#1B3A5C] text-white px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#243F6B] transition-colors duration-300"
        >
          Ver Catálogo
        </Link>
      </div>
    );
  }

  const mensagemWhatsApp = encodeURIComponent(
    `Ola! Gostaria de finalizar meu pedido:\n\n${itens
      .map(
        (i) =>
          `- ${i.produto.nome} (x${i.quantidade}) — ${formatarPreco(
            (i.produto.precoPromocional ?? i.produto.preco) * i.quantidade
          )}`
      )
      .join("\n")}${cupom ? `\n\nCupom: ${cupom} (-${formatarPreco(desconto)})` : ""}${presente && msgPresente ? `\n\nPresente: ${msgPresente}` : ""}\n\nTotal: ${formatarPreco(total)}`
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb itens={[{ label: "Carrinho" }]} />
      <h1 className="text-2xl font-medium text-[#1a1a2e] tracking-[0.03em] mb-4">
        Carrinho
      </h1>

      {/* Barra de frete grátis */}
      <div className="mb-10 bg-[#FBF6EE] p-4">
        {faltaParaFrete > 0 ? (
          <p className="text-[12px] text-[#666] font-light mb-2 text-center">
            Falta <span className="font-medium text-[#1B3A5C]">{formatarPreco(faltaParaFrete)}</span> para ganhar{" "}
            <span className="font-medium">frete grátis!</span>
          </p>
        ) : (
          <p className="text-[12px] text-[#1B3A5C] font-medium mb-2 text-center flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Você ganhou frete grátis!
          </p>
        )}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B3A5C] rounded-full transition-all duration-500"
            style={{ width: `${progressoFrete}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Itens */}
        <div className="lg:col-span-2">
          <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 pb-4 border-b border-[#eee] text-[11px] uppercase tracking-[0.12em] text-[#999] font-medium">
            <span>Produto</span>
            <span className="text-center">Quantidade</span>
            <span className="text-right">Subtotal</span>
            <span></span>
          </div>

          {itens.map((item) => {
            const preco = item.produto.precoPromocional ?? item.produto.preco;
            return (
              <div
                key={item.produto.id}
                className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_120px_120px_40px] gap-4 py-6 border-b border-[#eee] items-center"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-24 bg-[#FBF8F3] flex items-center justify-center text-2xl shrink-0">
                    💎
                  </div>
                  <div>
                    <Link
                      href={`/produto/${item.produto.id}`}
                      className="text-[15px] text-[#1a1a2e] hover:text-[#D4A843] transition-colors duration-300"
                    >
                      {item.produto.nome}
                    </Link>
                    <p className="text-[12px] text-[#999] font-light mt-1">
                      {formatarPreco(preco)} cada
                    </p>
                    {item.produto.precoPromocional && (
                      <p className="text-[11px] text-[#c44] font-light">
                        Economia: {formatarPreco((item.produto.preco - item.produto.precoPromocional) * item.quantidade)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-[#ddd]">
                    <button
                      onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                      className="px-3 py-1.5 text-[#666] hover:text-[#1a1a2e] transition-colors text-[15px]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-[15px] min-w-[40px] text-center border-x border-[#ddd]">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                      className="px-3 py-1.5 text-[#666] hover:text-[#1a1a2e] transition-colors text-[15px]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <span className="text-[14px] font-medium text-[#1a1a2e] text-right">
                  {formatarPreco(preco * item.quantidade)}
                </span>

                <button
                  onClick={() => remover(item.produto.id)}
                  className="text-[#ccc] hover:text-[#c44] transition-colors duration-300 justify-self-end"
                  title="Remover"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={limpar}
              className="text-[12px] text-[#999] hover:text-[#c44] font-light transition-colors duration-300"
            >
              Limpar carrinho
            </button>
            <Link
              href="/catalogo"
              className="text-[12px] text-[#D4A843] hover:text-[#1a1a2e] font-light transition-colors duration-300"
            >
              Continuar comprando
            </Link>
          </div>
        </div>

        {/* Resumo */}
        <div>
          <div className="bg-[#FBF8F3] p-8 space-y-6 sticky top-20 md:top-28">
            <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-6">
              Resumo do Pedido
            </h2>

            <div className="flex justify-between text-[15px]">
              <span className="text-[#666]">Subtotal</span>
              <span className="text-[#1a1a2e]">{formatarPreco(subtotal)}</span>
            </div>

            <div className="flex justify-between text-[15px]">
              <span className="text-[#666]">Frete</span>
              <span className={subtotal >= FRETE_GRATIS_MINIMO ? "text-[#1B3A5C] font-medium" : "text-[#1a1a2e]"}>
                {subtotal >= FRETE_GRATIS_MINIMO ? "Grátis" : "Calcular abaixo"}
              </span>
            </div>

            {cupom && (
              <div className="flex justify-between text-[14px]">
                <span className="text-[#1B3A5C] font-light flex items-center gap-2">
                  Cupom ({cupom})
                  <button onClick={removerCupom} className="text-[#c44] text-[11px] hover:underline">
                    remover
                  </button>
                </span>
                <span className="text-[#1B3A5C] font-medium">
                  -{formatarPreco(desconto)}
                </span>
              </div>
            )}

            <div className="border-t border-[#ddd] pt-4 flex justify-between">
              <span className="text-[14px] font-medium text-[#1a1a2e]">Total</span>
              <span className="text-[22px] font-semibold text-[#1a1a2e]">
                {formatarPreco(total)}
              </span>
            </div>

            <p className="text-[11px] text-[#999] font-light">
              ou até {config.maxParcelas}x de {formatarPreco(total / config.maxParcelas)} sem juros
            </p>

            {/* Cupom */}
            {!cupom && (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCupom}
                    onChange={(e) => setInputCupom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCupom()}
                    placeholder="Codigo do cupom"
                    className="flex-1 border border-[#ddd] bg-white px-3 py-2.5 text-[14px] focus:border-[#1a1a2e] outline-none transition-colors duration-300"
                  />
                  <button
                    onClick={handleCupom}
                    className="bg-[#1a1a2e] text-white px-5 py-2.5 text-[12px] uppercase tracking-[0.1em] font-medium hover:bg-[#333] transition-colors duration-300"
                  >
                    Aplicar
                  </button>
                </div>
                {erroCupom && (
                  <p className="text-[#c44] text-[12px] mt-2 font-light">{erroCupom}</p>
                )}
              </div>
            )}

            {/* Presente */}
            <div className="border border-dashed border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={presente} onChange={(e) => setPresente(e.target.checked)} className="w-4 h-4 accent-[#D4A843]" />
                <div>
                  <span className="text-[13px] font-medium text-[#1a1a2e]">🎁 E para presente?</span>
                  <span className="text-[11px] text-[#999] font-light block">Embalagem especial grátis</span>
                </div>
              </label>
              {presente && (
                <textarea
                  value={msgPresente}
                  onChange={(e) => setMsgPresente(e.target.value)}
                  placeholder="Escreva uma mensagem para o presenteado... (opcional)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] mt-3 resize-none h-16 outline-none focus:border-[#D4A843] transition-colors"
                  maxLength={200}
                />
              )}
            </div>

            <a
              href={`https://wa.me/${config.whatsapp}?text=${mensagemWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#1B3A5C] text-white text-center py-4 text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[#243F6B] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Finalizar pelo WhatsApp
            </a>

            {/* Seguranca */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <svg className="w-3.5 h-3.5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-[11px] text-[#999] font-light">Compra 100% segura</span>
            </div>
          </div>

          <div className="mt-6">
            <CalculoFrete />
          </div>
        </div>
      </div>
    </div>
  );
}

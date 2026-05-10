"use client";

import { useLoja } from "@/context/LojaContext";
import Breadcrumb from "@/components/Breadcrumb";

export default function Politicas() {
  const { config } = useLoja();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Breadcrumb itens={[{ label: "Políticas" }]} />
      <div className="text-center mb-16">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-3 font-medium">
          Informações
        </p>
        <h1 className="text-3xl font-light text-[#1a1a2e] tracking-[0.03em]">
          Políticas da Loja
        </h1>
      </div>

      <div className="space-y-14 text-[14px] text-[#666] font-light leading-relaxed">
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-6">
            Reembolso e Trocas
          </h2>
          <ul className="space-y-3 list-none">
            <li className="pl-4 border-l-2 border-[#D4A843]">
              Você tem até <strong className="font-medium">7 dias corridos</strong> após o recebimento
              para solicitar devolução (Art. 49 — CDC).
            </li>
            <li className="pl-4 border-l-2 border-[#eee]">O produto deve ser devolvido na embalagem original, sem sinais de uso.</li>
            <li className="pl-4 border-l-2 border-[#eee]">Para solicitar troca ou devolução, entre em contato pelo WhatsApp.</li>
            <li className="pl-4 border-l-2 border-[#eee]">Reembolso processado em até <strong className="font-medium">10 dias úteis</strong>.</li>
            <li className="pl-4 border-l-2 border-[#eee]">Frete de devolução por conta do cliente, exceto em defeito ou envio incorreto.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-6">Nota Fiscal</h2>
          <p>Todos os pedidos acompanham nota fiscal eletrônica (NF-e), enviada por e-mail no momento do despacho.</p>
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-6">Envio e Entrega</h2>
          <ul className="space-y-3 list-none">
            <li className="pl-4 border-l-2 border-[#eee]">Enviamos para todo o Brasil via Correios (PAC e SEDEX).</li>
            <li className="pl-4 border-l-2 border-[#D4A843]">
              <strong className="font-medium">Frete grátis</strong> para compras acima de R${config.freteGratisMinimo}.
            </li>
            <li className="pl-4 border-l-2 border-[#eee]">Prazo de envio: até <strong className="font-medium">2 dias úteis</strong> após confirmação.</li>
            <li className="pl-4 border-l-2 border-[#eee]">Codigo de rastreamento enviado por WhatsApp.</li>
            <li className="pl-4 border-l-2 border-[#eee]">Embalagem especial para joias.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-6">Pagamento</h2>
          <ul className="space-y-3 list-none">
            <li className="pl-4 border-l-2 border-[#eee]">Pix (instantâneo)</li>
            <li className="pl-4 border-l-2 border-[#eee]">Transferência bancária</li>
            <li className="pl-4 border-l-2 border-[#eee]">Parcele em até {config.maxParcelas}x sem juros</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-6">Contato</h2>
          <p>
            Dúvidas ou sugestões? Fale com a gente pelo{" "}
            <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:text-[#1a1a2e] transition-colors duration-300 font-medium">
              WhatsApp
            </a>
            {config.email && (
              <> ou por e-mail: <a href={`mailto:${config.email}`} className="text-[#D4A843] hover:text-[#1a1a2e] transition-colors duration-300 font-medium">{config.email}</a></>
            )}
            . Atendimento de segunda a sexta, das 9h as 18h.
          </p>
        </section>
      </div>
    </div>
  );
}

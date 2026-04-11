"use client";

import { useLoja } from "@/context/LojaContext";
import Link from "next/link";
import AnimacaoScroll from "@/components/AnimacaoScroll";

export default function SobrePage() {
  const { config, paginas } = useLoja();
  const paginaSobre = paginas.find(p => p.id === "sobre");

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#FBF8F3] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-4 font-medium">Nossa História</p>
          <h1 className="text-3xl md:text-5xl text-[#1a1a2e] tracking-[0.03em] mb-6">
            {config.nomeLoja}
          </h1>
          <p className="text-[15px] text-[#666] leading-relaxed max-w-xl mx-auto">
            {paginaSobre?.conteudo || `${config.tagline}. Nascemos da paixão por peças que carregam significado,`}
            brilho e personalidade.
          </p>
        </div>
      </section>

      {/* Valores */}
      <AnimacaoScroll>
        <section className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                titulo: "Nossa Missão",
                texto: "Levar elegância e luz para o dia a dia de cada mulher, com peças em prata de alta qualidade que contam histórias e celebram momentos.",
                icone: "✨",
              },
              {
                titulo: "Qualidade",
                texto: "Trabalhamos com prata 925 e banhos de ouro 18k, garantindo durabilidade e acabamento premium em cada peça que criamos.",
                icone: "💎",
              },
              {
                titulo: "Atendimento",
                texto: "Acreditamos que cada cliente merece atenção especial. Estamos sempre disponíveis para ajudar a encontrar a peça perfeita.",
                icone: "💛",
              },
            ].map((item, i) => (
              <AnimacaoScroll key={i} delay={i * 150}>
                <div className="text-center">
                  <span className="text-4xl mb-4 block">{item.icone}</span>
                  <h3 className="text-lg font-light text-[#1a1a2e] mb-3">{item.titulo}</h3>
                  <p className="text-[15px] text-[#666] leading-relaxed">{item.texto}</p>
                </div>
              </AnimacaoScroll>
            ))}
          </div>
        </section>
      </AnimacaoScroll>

      {/* Numeros */}
      <AnimacaoScroll>
        <section className="bg-[#1a1a2e] py-16 px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "1500+", label: "Clientes felizes" },
              { num: "100%", label: "Prata legítima" },
              { num: "6 meses", label: "Garantia" },
              { num: "7 dias", label: "Troca grátis" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl text-[#D4A843]">{s.num}</p>
                <p className="text-[12px] text-white/50 font-light mt-1 uppercase tracking-[0.1em]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimacaoScroll>

      {/* Compromisso */}
      <AnimacaoScroll>
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-4 font-medium">
            Nosso Compromisso
          </p>
          <h2 className="text-3xl md:text-4xl text-[#1a1a2e] tracking-[0.03em] mb-6">
            Cada peça e feita para <span className="italic">brilhar</span>
          </h2>
          <p className="text-[15px] text-[#666] leading-relaxed mb-8">
            Selecionamos cuidadosamente cada material e acompanhamos todo o processo de
            produção para garantir que você receba uma joia a altura dos seus momentos
            mais especiais. Da escolha da prata ao acabamento final, cada detalhe importa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo" className="bg-[#1B3A5C] text-white px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#243F6B] transition-colors">
              Conhecer Coleção
            </Link>
            <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="border border-[#1a1a2e] text-[#1a1a2e] px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#1a1a2e] hover:text-white transition-all">
              Falar Conosco
            </a>
          </div>
        </section>
      </AnimacaoScroll>
    </div>
  );
}

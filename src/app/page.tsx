"use client";

import CardProduto from "@/components/CardProduto";
import { useLoja } from "@/context/LojaContext";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import CarrosselProdutos from "@/components/CarrosselProdutos";
import Beneficios from "@/components/Beneficios";
import AnimacaoScroll from "@/components/AnimacaoScroll";
import ContadorStats from "@/components/ContadorStats";
import Countdown from "@/components/Countdown";
import InstagramFeed from "@/components/InstagramFeed";

export default function Home() {
  const { produtos, depoimentos, config, categorias: categoriasLoja } = useLoja();
  const destaques = produtos.filter((p) => p.destaque);
  const novidades = produtos.filter((p) => p.novo);
  const promocoes = produtos.filter((p) => p.precoPromocional);
  const maisVendidos = produtos.filter((p) => p.maisVendido);

  const categorias = categoriasLoja.filter(c => c.ativo).map(c => ({
    nome: c.nome, emoji: c.emoji, desc: c.descricao,
    qtd: produtos.filter(p => p.categoria === c.nome).length,
  }));

  // Helper pra checar seção visível e pegar textos
  const secoes = config.secoes || [];
  function secao(id: string) {
    return secoes.find(s => s.id === id) || { visivel: true, subtitulo: "", titulo: "", descricao: "", textoBotao: "", imagem: "" };
  }
  function visivel(id: string) { return secao(id).visivel !== false; }

  const sPromo = secao("promocao");
  const sWhatsApp = secao("whatsapp");
  const sCat = secao("categorias");
  const sLanc = secao("lancamentos");
  const sMV = secao("maisVendidos");
  const sDest = secao("destaques");
  const sDep = secao("depoimentos");
  const sTodos = secao("todosOsProdutos");
  const sInsta = secao("instagram");

  return (
    <>
      {/* Hero Banner Carrossel */}
      {visivel("banner") && <HeroBanner />}

      {/* Benefícios */}
      {visivel("beneficios") && <Beneficios />}

      {/* Categorias */}
      {visivel("categorias") && (
        <AnimacaoScroll>
          <section className="max-w-[1400px] mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4A843]/80 mb-4 font-semibold">
                {sCat.subtitulo || "Navegue por"}
              </p>
              <h2 className="text-3xl md:text-4xl text-[#1a1a2e]">
                {sCat.titulo || "Categorias"}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categorias.map((cat, i) => (
                <AnimacaoScroll key={cat.nome} delay={i * 100}>
                  <Link href={`/catalogo?cat=${cat.nome}`} className="group aspect-square bg-[#FBF8F3] flex flex-col items-center justify-center gap-3 hover:bg-[#1a1a2e] transition-all duration-500 relative overflow-hidden">
                    <span className="text-4xl opacity-40 group-hover:opacity-80 group-hover:scale-125 transition-all duration-500">{cat.emoji}</span>
                    <span className="text-[13px] uppercase tracking-[0.12em] text-[#1a1a2e] group-hover:text-white transition-colors duration-500">{cat.nome}</span>
                    <span className="text-[10px] text-[#999] group-hover:text-white/60 transition-colors duration-500">{cat.desc}</span>
                    <span className="absolute top-3 right-3 text-[10px] text-[#ccc] group-hover:text-white/40 transition-colors duration-500">{cat.qtd} peças</span>
                  </Link>
                </AnimacaoScroll>
              ))}
            </div>
          </section>
        </AnimacaoScroll>
      )}

      {/* Lançamentos */}
      {visivel("lancamentos") && novidades.length > 0 && (
        <AnimacaoScroll>
          <section className="max-w-[1400px] mx-auto px-6 pb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-2 font-medium">{sLanc.subtitulo || "Acabou de chegar"}</p>
                <h2 className="text-3xl md:text-4xl text-[#1a1a2e]">{sLanc.titulo || "Lançamentos"}</h2>
              </div>
              <Link href="/catalogo" className="text-[12px] uppercase tracking-[0.1em] text-[#D4A843] hover:text-[#1a1a2e] transition-colors border-b border-[#D4A843] hover:border-[#1a1a2e] pb-0.5">
                {sLanc.textoBotao || "Ver todos"}
              </Link>
            </div>
            <CarrosselProdutos produtos={novidades} id="lancamentos" />
          </section>
        </AnimacaoScroll>
      )}

      {/* Banner Promoção */}
      {visivel("promocao") && promocoes.length > 0 && (
        <AnimacaoScroll>
          <section className="relative bg-[#1a1a2e] overflow-hidden" style={sPromo.imagem ? { backgroundImage: `url(${sPromo.imagem})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
            {!sPromo.imagem && (
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D4A843 1px, transparent 1px), radial-gradient(circle at 80% 20%, #D4A843 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
              </div>
            )}
            {sPromo.imagem && <div className="absolute inset-0 bg-[#1a1a2e]/70" />}
            <div className="max-w-[1400px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-4 font-medium">{sPromo.subtitulo}</p>
                <h2 className="text-3xl md:text-5xl text-white leading-tight mb-4">{sPromo.titulo}</h2>
                <div className="mb-6"><Countdown label="Oferta encerra em:" /></div>
                <p className="text-[15px] text-white/60 mb-8 max-w-md">{sPromo.descricao}</p>
                <Link href="/catalogo" className="inline-block bg-[#D4A843] text-white px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#C49A30] transition-colors">{sPromo.textoBotao}</Link>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {promocoes.slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/produto/${p.id}`} className="aspect-square bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group relative">
                    <div className="text-center">
                      <span className="text-3xl opacity-50 group-hover:opacity-80 transition-opacity">💎</span>
                      <p className="text-[11px] text-white/60 mt-2">{p.nome}</p>
                      <p className="text-[12px] text-[#D4A843] font-medium mt-1">{p.precoPromocional?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </div>
                    <span className="absolute top-2 right-2 bg-[#c44] text-white text-[9px] px-1.5 py-0.5 font-medium">-{Math.round(((p.preco - (p.precoPromocional ?? p.preco)) / p.preco) * 100)}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AnimacaoScroll>
      )}

      {/* Mais Vendidos */}
      {visivel("maisVendidos") && maisVendidos.length > 0 && (
        <AnimacaoScroll>
          <section className="max-w-[1400px] mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-2 font-medium">{sMV.subtitulo || "Campeões de venda"}</p>
                <h2 className="text-3xl md:text-4xl text-[#1a1a2e]">{sMV.titulo || "Mais Vendidos"}</h2>
              </div>
              <Link href="/catalogo" className="text-[12px] uppercase tracking-[0.1em] text-[#D4A843] hover:text-[#1a1a2e] transition-colors border-b border-[#D4A843] hover:border-[#1a1a2e] pb-0.5">{sMV.textoBotao || "Ver todos"}</Link>
            </div>
            <CarrosselProdutos produtos={maisVendidos} id="vendidos" />
          </section>
        </AnimacaoScroll>
      )}

      {/* Stats */}
      {visivel("stats") && <AnimacaoScroll><ContadorStats /></AnimacaoScroll>}

      {/* Destaques */}
      {visivel("destaques") && destaques.length > 0 && (
        <AnimacaoScroll>
          <section className="max-w-[1400px] mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-2 font-medium">{sDest.subtitulo || "Os mais amados"}</p>
                <h2 className="text-3xl md:text-4xl text-[#1a1a2e]">{sDest.titulo || "Destaques"}</h2>
              </div>
              <Link href="/catalogo" className="text-[12px] uppercase tracking-[0.1em] text-[#D4A843] hover:text-[#1a1a2e] transition-colors border-b border-[#D4A843] hover:border-[#1a1a2e] pb-0.5">{sDest.textoBotao || "Ver todos"}</Link>
            </div>
            <CarrosselProdutos produtos={destaques} id="destaques" />
          </section>
        </AnimacaoScroll>
      )}

      {/* Depoimentos */}
      {visivel("depoimentos") && depoimentos.length > 0 && (
        <AnimacaoScroll>
          <section className="bg-[#FBF6EE] py-16">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="text-center mb-12">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4A843]/80 mb-4 font-semibold">{sDep.subtitulo || "O que dizem"}</p>
                <h2 className="text-3xl md:text-4xl text-[#1a1a2e]">{sDep.titulo || "Nossas Clientes"}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {depoimentos.slice(0, 3).map((dep, i) => (
                  <AnimacaoScroll key={i} delay={i * 150}>
                    <div className="bg-white p-8 relative">
                      <svg className="w-8 h-8 text-[#D4A843] opacity-20 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849h4V21H0z"/></svg>
                      <p className="text-[14px] text-[#666] leading-relaxed mb-6 italic">&ldquo;{dep.texto}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F0E8D8] flex items-center justify-center text-[13px] font-medium text-[#D4A843]">{dep.nome.charAt(0)}</div>
                        <div><p className="text-[13px] font-medium text-[#1a1a2e]">{dep.nome}</p><p className="text-[11px] text-[#999]">{dep.produto}</p></div>
                      </div>
                      <div className="flex gap-0.5 mt-3">
                        {Array.from({ length: dep.nota }).map((_, j) => (
                          <svg key={j} className="w-3 h-3 text-[#D4A843]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z" /></svg>
                        ))}
                      </div>
                    </div>
                  </AnimacaoScroll>
                ))}
              </div>
            </div>
          </section>
        </AnimacaoScroll>
      )}

      {/* WhatsApp CTA */}
      {visivel("whatsapp") && (
        <AnimacaoScroll>
          <section className="bg-[#1B3A5C] py-16 px-6" style={sWhatsApp.imagem ? { backgroundImage: `url(${sWhatsApp.imagem})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
            {sWhatsApp.imagem && <div className="absolute inset-0 bg-[#1B3A5C]/80" />}
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-4 font-medium">{sWhatsApp.subtitulo}</p>
              <h2 className="text-3xl md:text-4xl text-white leading-tight mb-6">{sWhatsApp.titulo}</h2>
              <p className="text-[15px] text-white/60 mb-8">{sWhatsApp.descricao}</p>
              <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-[#1B3A5C] px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#f5f5f5] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {sWhatsApp.textoBotao || "Fale Conosco"}
              </a>
            </div>
          </section>
        </AnimacaoScroll>
      )}

      {/* Todos os Produtos */}
      {visivel("todosOsProdutos") && (
        <AnimacaoScroll>
          <section className="max-w-[1400px] mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4A843]/80 mb-4 font-semibold">{sTodos.subtitulo || "Coleção Completa"}</p>
              <h2 className="text-3xl md:text-4xl text-[#1a1a2e]">{sTodos.titulo || "Todas as Peças"}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {produtos.map((produto, i) => (
                <AnimacaoScroll key={produto.id} delay={(i % 4) * 100}>
                  <CardProduto produto={produto} />
                </AnimacaoScroll>
              ))}
            </div>
          </section>
        </AnimacaoScroll>
      )}

      {/* Instagram */}
      {visivel("instagram") && <AnimacaoScroll><InstagramFeed /></AnimacaoScroll>}
    </>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import IconeCarrinho from "./IconeCarrinho";
import BuscaModal from "./BuscaModal";
import { useFavoritos } from "@/context/FavoritosContext";
import { useLoja } from "@/context/LojaContext";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalFavoritos } = useFavoritos();
  const { config } = useLoja();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setBuscaAberta(true);
      }
    }
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categorias = [
    { nome: "Catálogo", href: "/catalogo" },
    { nome: "Colares", href: "/catalogo?cat=Colares" },
    { nome: "Brincos", href: "/catalogo?cat=Brincos" },
    { nome: "Anéis", href: "/catalogo?cat=Aneis" },
    { nome: "Pulseiras", href: "/catalogo?cat=Pulseiras" },
  ];

  return (
    <>
      <header className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-sm" : "border-b border-gray-100/80"}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Menu mobile */}
          <button className="lg:hidden text-[#1a1a2e]" onClick={() => setMenuAberto(!menuAberto)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Nav esquerda */}
          <nav className="hidden lg:flex items-center gap-8">
            {categorias.map((cat) => (
              <Link key={cat.nome} href={cat.href} className="text-[12px] uppercase tracking-[0.12em] text-[#1a1a2e]/70 hover:text-[#D4A843] transition-colors duration-300 font-medium">
                {cat.nome}
              </Link>
            ))}
          </nav>

          {/* Logo central */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
            <span className="logo-brand text-[22px] text-[#1B3A5C] block leading-none group-hover:text-gold-gradient transition-all duration-300">
              {config.nomeLoja}
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-[#D4A843]/70 font-medium mt-0.5 block">
              {config.tagline}
            </span>
          </Link>

          {/* Icones direita */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setBuscaAberta(true)}
              className="text-[#1a1a2e]/60 hover:text-[#D4A843] transition-colors duration-300"
              aria-label="Buscar"
              title="Ctrl+K"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <Link href="/favoritos" className="text-[#1a1a2e]/60 hover:text-[#D4A843] transition-colors duration-300 relative" aria-label="Favoritos">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {totalFavoritos > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4A843] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalFavoritos}
                </span>
              )}
            </Link>

            <IconeCarrinho />
          </div>
        </div>

        {/* Menu mobile expandido */}
        {menuAberto && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slideDown">
            <div className="px-6 py-6 flex flex-col gap-4">
              {[...categorias, { nome: "Conjuntos", href: "/catalogo?cat=Conjuntos" }, { nome: "Sobre nos", href: "/sobre" }].map((item) => (
                <Link key={item.nome} href={item.href} className="text-[13px] uppercase tracking-[0.1em] text-[#1a1a2e]/70 hover:text-[#D4A843] transition-colors font-medium" onClick={() => setMenuAberto(false)}>
                  {item.nome}
                </Link>
              ))}
              <hr className="border-gray-100" />
              <Link href="/favoritos" className="text-[13px] uppercase tracking-[0.1em] text-[#1a1a2e]/70 flex items-center gap-2 font-medium" onClick={() => setMenuAberto(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Favoritos {totalFavoritos > 0 && `(${totalFavoritos})`}
              </Link>
            </div>
          </div>
        )}
      </header>

      <BuscaModal aberta={buscaAberta} onFechar={() => setBuscaAberta(false)} />
    </>
  );
}

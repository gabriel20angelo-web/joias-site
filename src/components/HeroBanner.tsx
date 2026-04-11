"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useLoja } from "@/context/LojaContext";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroBanner() {
  const { banners } = useLoja();
  const ativos = banners.filter((b) => b.ativo);

  if (ativos.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={ativos.length > 1}
      className="hero-swiper"
    >
      {ativos.map((banner) => (
        <SwiperSlide key={banner.id}>
          <section className="relative overflow-hidden" style={{ backgroundColor: banner.bg }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4A843]/[0.03] rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#1B3A5C]/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-28 md:py-44 flex flex-col items-center text-center relative z-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4A843] mb-5 font-medium animate-fadeUp">
                {banner.subtitulo}
              </p>
              <div className="gold-divider mb-6 animate-fadeUp" />
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-[#1a1a2e] mb-8 animate-fadeUp animation-delay-100">
                {banner.titulo[0]}
                <br />
                <span className="italic">{banner.titulo[1]}</span>
              </h1>
              <p className="text-[15px] text-[#888] max-w-lg mb-10 leading-relaxed animate-fadeUp animation-delay-200">
                {banner.descricao}
              </p>
              <Link
                href={banner.link}
                className="bg-[#1B3A5C] text-white px-10 py-4 text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-[#243F6B] transition-all duration-300 btn-lift animate-fadeUp animation-delay-300"
              >
                {banner.textoBotao}
              </Link>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

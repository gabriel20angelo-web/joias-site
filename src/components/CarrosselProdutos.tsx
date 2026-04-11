"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Produto } from "@/types/produto";
import CardProduto from "./CardProduto";
import "swiper/css";
import "swiper/css/navigation";

export default function CarrosselProdutos({ produtos, id }: { produtos: Produto[]; id: string }) {
  return (
    <div className="relative group/slider">
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{
          nextEl: `.next-${id}`,
          prevEl: `.prev-${id}`,
        }}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        loop={produtos.length > 4}
        className="!pb-2"
      >
        {produtos.map((produto) => (
          <SwiperSlide key={produto.id}>
            <CardProduto produto={produto} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className={`prev-${id} absolute left-0 top-1/3 -translate-x-3 z-10 w-10 h-10 bg-white shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:bg-[#FBF8F3]`}
      >
        <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        className={`next-${id} absolute right-0 top-1/3 translate-x-3 z-10 w-10 h-10 bg-white shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:bg-[#FBF8F3]`}
      >
        <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

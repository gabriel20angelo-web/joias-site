"use client";

import Link from "next/link";
import { useCarrinho } from "@/context/CarrinhoContext";

export default function IconeCarrinho() {
  const { totalItens } = useCarrinho();

  return (
    <Link href="/carrinho" className="relative text-[#1a1a2e] hover:text-[#D4A843] transition-colors duration-300">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      {totalItens > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#1B3A5C] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
          {totalItens}
        </span>
      )}
    </Link>
  );
}

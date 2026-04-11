"use client";

import { ReactNode } from "react";
import { CarrinhoProvider } from "@/context/CarrinhoContext";
import { FavoritosProvider } from "@/context/FavoritosContext";
import { ToastProvider } from "@/context/ToastContext";
import { LojaProvider } from "@/context/LojaContext";
import { FinanceiroProvider } from "@/context/FinanceiroContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <FinanceiroProvider>
      <LojaProvider>
        <FavoritosProvider>
          <CarrinhoProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CarrinhoProvider>
        </FavoritosProvider>
      </LojaProvider>
    </FinanceiroProvider>
  );
}

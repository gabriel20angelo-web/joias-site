"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Produto } from "@/types/produto";

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionar: (produto: Produto) => void;
  remover: (produtoId: string) => void;
  alterarQuantidade: (produtoId: string, quantidade: number) => void;
  limpar: () => void;
  cupom: string | null;
  aplicarCupom: (codigo: string) => boolean;
  removerCupom: () => void;
  desconto: number;
  subtotal: number;
  total: number;
  totalItens: number;
}

function getCuponsAtivos(): Record<string, number> {
  const defaults: Record<string, number> = { PRIMEIRACOMPRA: 10, JOIAS15: 15, FRETE10: 10 };
  if (typeof window === "undefined") return defaults;
  try {
    const salvo = localStorage.getItem("loja_cupons");
    if (salvo) {
      const cupons = JSON.parse(salvo) as { codigo: string; desconto: number; ativo: boolean }[];
      const map: Record<string, number> = {};
      cupons.filter(c => c.ativo).forEach(c => { map[c.codigo] = c.desconto; });
      return map;
    }
  } catch {}
  return defaults;
}

const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [cupom, setCupom] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Carregar do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) {
      try {
        setItens(JSON.parse(salvo));
      } catch {}
    }
    const cupomSalvo = localStorage.getItem("cupom");
    if (cupomSalvo) setCupom(cupomSalvo);
    setLoaded(true);
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("carrinho", JSON.stringify(itens));
  }, [itens, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (cupom) localStorage.setItem("cupom", cupom);
    else localStorage.removeItem("cupom");
  }, [cupom, loaded]);

  function adicionar(produto: Produto) {
    setItens((prev) => {
      const existe = prev.find((i) => i.produto.id === produto.id);
      if (existe) {
        return prev.map((i) =>
          i.produto.id === produto.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  }

  function remover(produtoId: string) {
    setItens((prev) => prev.filter((i) => i.produto.id !== produtoId));
  }

  function alterarQuantidade(produtoId: string, quantidade: number) {
    if (quantidade <= 0) return remover(produtoId);
    setItens((prev) =>
      prev.map((i) =>
        i.produto.id === produtoId ? { ...i, quantidade } : i
      )
    );
  }

  function limpar() {
    setItens([]);
    setCupom(null);
  }

  function aplicarCupom(codigo: string): boolean {
    const upper = codigo.toUpperCase().trim();
    const cuponsAtivos = getCuponsAtivos();
    if (cuponsAtivos[upper]) {
      setCupom(upper);
      return true;
    }
    return false;
  }

  function removerCupom() {
    setCupom(null);
  }

  const subtotal = itens.reduce((acc, item) => {
    const preco = item.produto.precoPromocional ?? item.produto.preco;
    return acc + preco * item.quantidade;
  }, 0);

  const cuponsAtivos = getCuponsAtivos();
  const desconto = cupom && cuponsAtivos[cupom] ? (subtotal * cuponsAtivos[cupom]) / 100 : 0;
  const total = subtotal - desconto;
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionar,
        remover,
        alterarQuantidade,
        limpar,
        cupom,
        aplicarCupom,
        removerCupom,
        desconto,
        subtotal,
        total,
        totalItens,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho precisa estar dentro de CarrinhoProvider");
  return ctx;
}

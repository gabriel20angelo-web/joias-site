"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritosContextType {
  favoritos: string[];
  toggleFavorito: (id: string) => void;
  isFavorito: (id: string) => boolean;
  totalFavoritos: number;
}

const FavoritosContext = createContext<FavoritosContextType | null>(null);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem("favoritos");
    if (salvo) {
      try { setFavoritos(JSON.parse(salvo)); } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos, loaded]);

  function toggleFavorito(id: string) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function isFavorito(id: string) {
    return favoritos.includes(id);
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito, totalFavoritos: favoritos.length }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos precisa estar dentro de FavoritosProvider");
  return ctx;
}

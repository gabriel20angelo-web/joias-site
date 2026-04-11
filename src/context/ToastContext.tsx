"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: number;
  mensagem: string;
  tipo: "sucesso" | "info" | "erro";
}

interface ToastContextType {
  mostrar: (mensagem: string, tipo?: "sucesso" | "info" | "erro") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mostrar = useCallback((mensagem: string, tipo: "sucesso" | "info" | "erro" = "sucesso") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, mensagem, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrar }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-5 py-3 shadow-lg text-[14px] flex items-center gap-3 animate-slideIn ${
              toast.tipo === "sucesso"
                ? "bg-[#1B3A5C] text-white"
                : toast.tipo === "erro"
                ? "bg-[#c44] text-white"
                : "bg-[#1a1a2e] text-white"
            }`}
          >
            {toast.tipo === "sucesso" && (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {toast.mensagem}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de ToastProvider");
  return ctx;
}

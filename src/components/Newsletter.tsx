"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      // Salvar no localStorage para o admin ver
      try {
        const salvo = localStorage.getItem("newsletter_inscritos");
        const inscritos = salvo ? JSON.parse(salvo) : [];
        if (!inscritos.find((i: { email: string }) => i.email === email.toLowerCase())) {
          inscritos.unshift({ email: email.toLowerCase(), data: new Date().toISOString() });
          localStorage.setItem("newsletter_inscritos", JSON.stringify(inscritos));
        }
      } catch {}
      setEnviado(true);
      setEmail("");
    }
  }

  return (
    <section className="bg-[#F0E8D8] py-16 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-3 font-medium">
          Fique por dentro
        </p>
        <h2 className="text-3xl md:text-4xl text-[#1a1a2e] tracking-[0.03em] mb-3">
          Receba novidades e ofertas
        </h2>
        <p className="text-[13px] text-[#999] font-light mb-8">
          Cadastre seu e-mail e ganhe 10% de desconto na primeira compra
        </p>

        {enviado ? (
          <div className="bg-[#1B3A5C] text-white py-4 px-6 text-[14px] flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            E-mail cadastrado com sucesso!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="flex-1 border border-[#ddd] border-r-0 bg-white px-5 py-3.5 text-[14px] focus:border-[#1a1a2e] outline-none transition-colors duration-300"
            />
            <button
              type="submit"
              className="bg-[#1B3A5C] text-white px-8 py-3.5 text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[#243F6B] transition-colors duration-300 shrink-0"
            >
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

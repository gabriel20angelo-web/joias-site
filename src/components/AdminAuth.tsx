"use client";

import { useState, useEffect, ReactNode } from "react";

const SENHA_PADRAO = "auramel2026";

export default function AdminAuth({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const sessao = sessionStorage.getItem("admin_auth");
    if (sessao === "true") setAutenticado(true);
    setVerificando(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Checa senha custom do localStorage ou usa padrao
    const senhaCustom = localStorage.getItem("admin_senha");
    const senhaCorreta = senhaCustom || SENHA_PADRAO;

    if (senha === senhaCorreta) {
      sessionStorage.setItem("admin_auth", "true");
      setAutenticado(true);
      setErro(false);
    } else {
      setErro(true);
      setSenha("");
    }
  }

  if (verificando) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
          <div className="text-center mb-8">
            <span className="logo-brand text-2xl text-[#1B3A5C]">AURA MEL</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4A843] mt-1">Painel Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-1.5">Senha de acesso</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro(false); }}
                placeholder="Digite a senha..."
                autoFocus
                className={`w-full border rounded-lg px-4 py-3 text-[14px] outline-none transition-colors ${
                  erro ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#D4A843]"
                }`}
              />
              {erro && <p className="text-red-500 text-[12px] mt-1.5">Senha incorreta.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#1B3A5C] text-white py-3 text-[13px] font-medium rounded-lg hover:bg-[#243F6B] transition-colors"
            >
              Entrar
            </button>
          </form>

          <p className="text-[11px] text-[#ccc] text-center mt-6">Acesso restrito ao administrador</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

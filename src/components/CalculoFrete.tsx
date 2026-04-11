"use client";

import { useState } from "react";

interface ResultadoFrete {
  tipo: string;
  prazo: string;
  valor: number;
}

export default function CalculoFrete() {
  const [cep, setCep] = useState("");
  const [resultados, setResultados] = useState<ResultadoFrete[] | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function calcular() {
    setErro("");
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setErro("CEP inválido. Digite 8 números.");
      return;
    }

    setCarregando(true);
    setTimeout(() => {
      setResultados([
        { tipo: "PAC", prazo: "8 a 12 dias úteis", valor: 18.9 },
        { tipo: "SEDEX", prazo: "3 a 5 dias úteis", valor: 32.5 },
      ]);
      setCarregando(false);
    }, 800);
  }

  function formatarCep(valor: string) {
    const nums = valor.replace(/\D/g, "").slice(0, 8);
    if (nums.length > 5) return `${nums.slice(0, 5)}-${nums.slice(5)}`;
    return nums;
  }

  return (
    <div className="border-t border-[#eee] pt-8">
      <h3 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a2e] mb-4">
        Calcular Frete
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(formatarCep(e.target.value))}
          placeholder="00000-000"
          className="flex-1 border border-[#ddd] px-4 py-2.5 text-[14px] focus:border-[#1a1a2e] outline-none transition-colors duration-300"
        />
        <button
          onClick={calcular}
          disabled={carregando}
          className="bg-[#1a1a2e] text-white px-6 py-2.5 text-[12px] uppercase tracking-[0.1em] font-medium hover:bg-[#333] transition-colors duration-300 disabled:opacity-50"
        >
          {carregando ? "..." : "Calcular"}
        </button>
      </div>

      {erro && <p className="text-[#c44] text-[12px] mt-2 font-light">{erro}</p>}

      {resultados && (
        <div className="mt-4 space-y-2">
          {resultados.map((r) => (
            <div
              key={r.tipo}
              className="flex items-center justify-between bg-[#FBF8F3] px-4 py-3 text-[13px]"
            >
              <div>
                <span className="font-medium text-[#1a1a2e]">{r.tipo}</span>
                <span className="text-[#999] ml-3 font-light">{r.prazo}</span>
              </div>
              <span className="font-medium text-[#1a1a2e]">
                {r.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

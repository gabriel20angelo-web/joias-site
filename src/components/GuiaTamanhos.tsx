"use client";

import { useState, useEffect } from "react";

const tamanhosAneis = [
  { num: 14, diametro: "15.3mm", circunferencia: "48mm" },
  { num: 15, diametro: "15.7mm", circunferencia: "49.3mm" },
  { num: 16, diametro: "16.1mm", circunferencia: "50.6mm" },
  { num: 17, diametro: "16.5mm", circunferencia: "51.8mm" },
  { num: 18, diametro: "16.9mm", circunferencia: "53.1mm" },
  { num: 19, diametro: "17.3mm", circunferencia: "54.4mm" },
  { num: 20, diametro: "17.7mm", circunferencia: "55.6mm" },
  { num: 21, diametro: "18.2mm", circunferencia: "57.2mm" },
  { num: 22, diametro: "18.6mm", circunferencia: "58.4mm" },
];

const tamanhosPulseiras = [
  { nome: "PP", medida: "15cm", pulso: "Até 14cm" },
  { nome: "P", medida: "17cm", pulso: "14-16cm" },
  { nome: "M", medida: "19cm", pulso: "16-18cm" },
  { nome: "G", medida: "21cm", pulso: "18-20cm" },
];

export default function GuiaTamanhos({ tipo }: { tipo: "anel" | "pulseira" }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (aberto) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [aberto]);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="text-[12px] text-[#D4A843] hover:text-[#1a1a2e] transition-colors font-light flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        Guia de tamanhos
      </button>

      {aberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAberto(false)} />
          <div className="relative bg-white max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl rounded-xl animate-scaleIn p-6">
            <button onClick={() => setAberto(false)} className="absolute top-4 right-4 text-[#999] hover:text-[#1a1a2e]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">
              Guia de Tamanhos — {tipo === "anel" ? "Anéis" : "Pulseiras"}
            </h2>

            {tipo === "anel" ? (
              <>
                <p className="text-[13px] text-[#666] font-light mb-4">
                  Para descobrir seu tamanho, enrole um fio ao redor do dedo e meca o comprimento em milimetros.
                </p>
                <table className="w-full text-[13px]">
                  <thead><tr className="bg-[#FBF8F3]">
                    <th className="py-2 px-3 text-left font-medium text-[#1a1a2e]">Tamanho</th>
                    <th className="py-2 px-3 text-left font-medium text-[#1a1a2e]">Diametro</th>
                    <th className="py-2 px-3 text-left font-medium text-[#1a1a2e]">Circunferencia</th>
                  </tr></thead>
                  <tbody>
                    {tamanhosAneis.map((t) => (
                      <tr key={t.num} className="border-b border-gray-50">
                        <td className="py-2 px-3 font-medium text-[#D4A843]">{t.num}</td>
                        <td className="py-2 px-3 text-[#666]">{t.diametro}</td>
                        <td className="py-2 px-3 text-[#666]">{t.circunferencia}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 bg-[#FBF8F3] p-4 rounded-lg">
                  <p className="text-[12px] font-medium text-[#1a1a2e] mb-2">Como medir:</p>
                  <ol className="text-[12px] text-[#666] font-light space-y-1.5 list-decimal list-inside">
                    <li>Enrole um barbante ao redor do dedo desejado</li>
                    <li>Marque onde o barbante se encontra</li>
                    <li>Meca o comprimento com uma regua</li>
                    <li>Compare com a coluna "Circunferencia"</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <p className="text-[13px] text-[#666] font-light mb-4">
                  Meca seu pulso com uma fita metrica no ponto mais fino, logo acima do osso.
                </p>
                <table className="w-full text-[13px]">
                  <thead><tr className="bg-[#FBF8F3]">
                    <th className="py-2 px-3 text-left font-medium text-[#1a1a2e]">Tamanho</th>
                    <th className="py-2 px-3 text-left font-medium text-[#1a1a2e]">Comprimento</th>
                    <th className="py-2 px-3 text-left font-medium text-[#1a1a2e]">Pulso</th>
                  </tr></thead>
                  <tbody>
                    {tamanhosPulseiras.map((t) => (
                      <tr key={t.nome} className="border-b border-gray-50">
                        <td className="py-2 px-3 font-medium text-[#D4A843]">{t.nome}</td>
                        <td className="py-2 px-3 text-[#666]">{t.medida}</td>
                        <td className="py-2 px-3 text-[#666]">{t.pulso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

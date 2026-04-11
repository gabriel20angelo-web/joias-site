"use client";

import { useState, useEffect } from "react";

interface Tema {
  corPrimaria: string;
  corAccent: string;
  corFundo: string;
  corTexto: string;
  corBege: string;
  fonteHeading: string;
  fonteBody: string;
  borderRadius: string;
}

const temaDefault: Tema = {
  corPrimaria: "#1B3A5C",
  corAccent: "#D4A843",
  corFundo: "#FFFDF9",
  corTexto: "#1a1a2e",
  corBege: "#FBF8F3",
  fonteHeading: "Cormorant Garamond",
  fonteBody: "Jost",
  borderRadius: "0",
};

const presets = [
  { nome: "Aura Mel (Padrao)", tema: temaDefault },
  { nome: "Midnight Gold", tema: { ...temaDefault, corPrimaria: "#0d0d0d", corAccent: "#c9a84c", corFundo: "#fafafa", corTexto: "#0d0d0d" } },
  { nome: "Rose Elegance", tema: { ...temaDefault, corPrimaria: "#8b4557", corAccent: "#c4887c", corFundo: "#fdf8f7", corTexto: "#3d2b2b" } },
  { nome: "Ocean Pearl", tema: { ...temaDefault, corPrimaria: "#1a4f5e", corAccent: "#68a89e", corFundo: "#f8fdfc", corTexto: "#1a2e2e" } },
  { nome: "Modern Minimal", tema: { ...temaDefault, corPrimaria: "#111111", corAccent: "#888888", corFundo: "#ffffff", corTexto: "#111111", fonteHeading: "Jost" } },
];

export default function AdminAparencia() {
  const [tema, setTema] = useState<Tema>(temaDefault);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("loja_tema");
      if (salvo) setTema(JSON.parse(salvo));
    } catch {}
  }, []);

  function salvar() {
    localStorage.setItem("loja_tema", JSON.stringify(tema));
    // Aplicar CSS vars
    document.documentElement.style.setProperty("--azul", tema.corPrimaria);
    document.documentElement.style.setProperty("--dourado", tema.corAccent);
    document.documentElement.style.setProperty("--background", tema.corFundo);
    document.documentElement.style.setProperty("--foreground", tema.corTexto);
    document.documentElement.style.setProperty("--creme", tema.corBege);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  }

  function aplicarPreset(preset: Tema) {
    setTema(preset);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Aparência</h1>
      <p className="text-[13px] text-[#999] mb-8">Personalize as cores e fontes da loja</p>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          {/* Presets */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Temas Prontos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presets.map((p) => (
                <button
                  key={p.nome}
                  onClick={() => aplicarPreset(p.tema)}
                  className="border border-gray-200 rounded-lg p-3 hover:border-[#D4A843] transition-colors text-left"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: p.tema.corPrimaria }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: p.tema.corAccent }} />
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: p.tema.corFundo }} />
                  </div>
                  <p className="text-[11px] font-medium text-[#1a1a2e]">{p.nome}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Cores</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "corPrimaria", label: "Cor Primaria (botoes, header)" },
                { key: "corAccent", label: "Cor Accent (dourado, destaques)" },
                { key: "corFundo", label: "Cor de Fundo" },
                { key: "corTexto", label: "Cor do Texto" },
                { key: "corBege", label: "Cor Bege (cards)" },
              ].map((campo) => (
                <div key={campo.key}>
                  <label className="block text-[12px] font-medium text-[#666] mb-1.5">{campo.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tema[campo.key as keyof Tema]}
                      onChange={(e) => setTema({ ...tema, [campo.key]: e.target.value })}
                      className="w-10 h-10 border border-gray-200 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={tema[campo.key as keyof Tema]}
                      onChange={(e) => setTema({ ...tema, [campo.key]: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[12px] font-mono outline-none focus:border-[#D4A843]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fontes */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Tipografia</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#666] mb-1.5">Fonte Titulos</label>
                <select value={tema.fonteHeading} onChange={(e) => setTema({ ...tema, fonteHeading: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none bg-white">
                  <option value="Cormorant Garamond">Cormorant Garamond (Serif)</option>
                  <option value="Jost">Jost (Sans-serif)</option>
                  <option value="Georgia">Georgia (Serif)</option>
                  <option value="system-ui">System UI</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#666] mb-1.5">Fonte Corpo</label>
                <select value={tema.fonteBody} onChange={(e) => setTema({ ...tema, fonteBody: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none bg-white">
                  <option value="Jost">Jost</option>
                  <option value="system-ui">System UI</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={salvar} className="bg-[#1B3A5C] text-white px-8 py-3 text-[13px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center gap-2">
            {salvo ? <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Salvo!</> : "Salvar Aparência"}
          </button>
        </div>

        {/* Preview */}
        <div className="sticky top-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-[12px] font-semibold text-[#999] uppercase tracking-wider mb-3">Preview</h3>
            <div className="rounded-lg overflow-hidden border border-gray-200" style={{ backgroundColor: tema.corFundo }}>
              {/* Header preview */}
              <div className="p-3 border-b flex items-center justify-center" style={{ borderColor: tema.corBege }}>
                <span style={{ color: tema.corPrimaria, fontFamily: tema.fonteHeading, fontSize: "16px", fontWeight: 500, letterSpacing: "0.15em" }}>AURA MEL</span>
              </div>
              {/* Banner preview */}
              <div className="p-6 text-center" style={{ backgroundColor: tema.corBege }}>
                <p style={{ color: tema.corAccent, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.2em" }}>Nova Coleção</p>
                <p style={{ color: tema.corTexto, fontFamily: tema.fonteHeading, fontSize: "20px", marginTop: "4px" }}>Pratas com Alma</p>
              </div>
              {/* Product preview */}
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-16 rounded flex items-center justify-center text-lg" style={{ backgroundColor: tema.corBege }}>💎</div>
                  <div>
                    <p style={{ color: tema.corTexto, fontSize: "12px", fontWeight: 500 }}>Colar Perolas</p>
                    <p style={{ color: tema.corAccent, fontSize: "11px" }}>R$ 149,90</p>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 text-white text-[10px] uppercase tracking-wider font-medium rounded" style={{ backgroundColor: tema.corPrimaria }}>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

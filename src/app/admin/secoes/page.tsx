"use client";
import { useLoja } from "@/context/LojaContext";
import { useState } from "react";

export default function AdminSecoes() {
  const { config, atualizarConfig } = useLoja();
  const secoes = config.secoes || [];
  const [editando, setEditando] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  function toggleVisivel(id: string) {
    const novas = secoes.map(s => s.id === id ? { ...s, visivel: !s.visivel } : s);
    atualizarConfig({ secoes: novas });
  }

  function atualizar(id: string, campo: string, valor: string) {
    const novas = secoes.map(s => s.id === id ? { ...s, [campo]: valor } : s);
    atualizarConfig({ secoes: novas });
  }

  function salvar() {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  const secaoEditando = secoes.find(s => s.id === editando);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Seções do Site</h1>
      <p className="text-[13px] text-[#999] mb-8">Mostre, oculte e edite o conteúdo de cada seção da página inicial</p>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        {/* Lista de seções */}
        <div className="space-y-2">
          {secoes.map(s => (
            <div key={s.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between gap-4 transition-all ${s.visivel ? "border-gray-100" : "border-red-100 bg-red-50/30 opacity-60"}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Toggle visibilidade */}
                <button
                  onClick={() => toggleVisivel(s.id)}
                  className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${s.visivel ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${s.visivel ? "left-5" : "left-1"}`} />
                </button>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-[#1a1a2e]">{s.nome}</p>
                  {s.titulo && <p className="text-[11px] text-[#999] truncate">{s.titulo}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {s.imagem && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Imagem</span>}
                <button
                  onClick={() => setEditando(editando === s.id ? null : s.id)}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${editando === s.id ? "bg-[#D4A843] text-white" : "text-[#D4A843] hover:bg-[#FBF8F3]"}`}
                >
                  {editando === s.id ? "Fechar" : "Editar"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Editor da seção selecionada */}
        {secaoEditando ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6 self-start sticky top-8">
            <h2 className="text-[14px] font-semibold text-[#1a1a2e] mb-1">Editando: {secaoEditando.nome}</h2>
            <p className="text-[11px] text-[#999] mb-4">Altere os textos e imagens desta seção</p>

            <div className="space-y-4">
              {/* Subtítulo */}
              <div>
                <label className="block text-[12px] font-medium text-[#666] mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={secaoEditando.subtitulo}
                  onChange={e => atualizar(secaoEditando.id, "subtitulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]"
                  placeholder="Texto pequeno acima do título"
                />
              </div>

              {/* Título */}
              <div>
                <label className="block text-[12px] font-medium text-[#666] mb-1">Título</label>
                <input
                  type="text"
                  value={secaoEditando.titulo}
                  onChange={e => atualizar(secaoEditando.id, "titulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]"
                  placeholder="Título principal da seção"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[12px] font-medium text-[#666] mb-1">Descrição</label>
                <textarea
                  value={secaoEditando.descricao}
                  onChange={e => atualizar(secaoEditando.id, "descricao", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843] resize-none h-20"
                  placeholder="Texto descritivo (opcional)"
                />
              </div>

              {/* Texto do botão */}
              {secaoEditando.textoBotao !== undefined && (
                <div>
                  <label className="block text-[12px] font-medium text-[#666] mb-1">Texto do Botão</label>
                  <input
                    type="text"
                    value={secaoEditando.textoBotao}
                    onChange={e => atualizar(secaoEditando.id, "textoBotao", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-[#D4A843]"
                    placeholder="Ex: Ver todos"
                  />
                </div>
              )}

              {/* Upload de imagem */}
              <div>
                <label className="block text-[12px] font-medium text-[#666] mb-1">Imagem de Fundo</label>
                {secaoEditando.imagem ? (
                  <div className="relative">
                    <img src={secaoEditando.imagem} alt="" className="w-full h-32 object-cover rounded-lg border" />
                    <button
                      onClick={() => atualizar(secaoEditando.id, "imagem", "")}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-[12px] flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block w-full border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-[#D4A843] transition-colors">
                      <svg className="w-8 h-8 text-[#ccc] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                      <p className="text-[12px] text-[#999]">Clique para enviar imagem</p>
                      <p className="text-[10px] text-[#ccc] mt-1">ou cole uma URL abaixo</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = ev => {
                            atualizar(secaoEditando.id, "imagem", ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Ou cole a URL da imagem..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-[12px] outline-none focus:border-[#D4A843] mt-2"
                      onBlur={e => { if (e.target.value) atualizar(secaoEditando.id, "imagem", e.target.value); }}
                    />
                  </div>
                )}
              </div>

              <button onClick={salvar} className="w-full bg-[#1B3A5C] text-white py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#243F6B] flex items-center justify-center gap-2">
                {salvo ? <>✓ Salvo!</> : "Salvar Alterações"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FBF8F3] rounded-xl p-8 text-center self-start">
            <p className="text-[14px] text-[#999]">Selecione uma seção para editar</p>
            <p className="text-[12px] text-[#ccc] mt-2">Você pode alterar textos, imagens e ocultar seções da página inicial</p>
          </div>
        )}
      </div>
    </div>
  );
}

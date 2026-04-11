"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Produto, Avaliacao } from "@/types/produto";
import { Banner, Cupom, Depoimento, Categoria, AvisoBarra, MsgWhatsApp, FretePorRegiao, PaginaConteudo, LogAtividade, AdminUser, ConfigLoja } from "@/types/loja";
import { produtos as produtosDefault } from "@/data/produtos";
import { categoriasDefault, bannersDefault, cuponsDefault, depoimentosDefault, avisosBarraDefault, msgsWhatsAppDefault, fretesPorRegiaoDefault, paginasDefault, configDefault } from "@/data/defaults";

// Re-export types for backward compatibility
export type { Banner, Cupom, Depoimento, Categoria, AvisoBarra, MsgWhatsApp, FretePorRegiao, PaginaConteudo, LogAtividade, AdminUser, ConfigLoja } from "@/types/loja";

interface LojaContextType {
  produtos: Produto[]; banners: Banner[]; cupons: Cupom[]; depoimentos: Depoimento[];
  categorias: Categoria[]; avisosBarra: AvisoBarra[]; msgsWhatsApp: MsgWhatsApp[];
  fretesPorRegiao: FretePorRegiao[]; paginas: PaginaConteudo[]; logs: LogAtividade[];
  admins: AdminUser[]; config: ConfigLoja;
  // Produtos
  adicionarProduto: (p: Omit<Produto, "id" | "criadoEm">) => void;
  atualizarProduto: (id: string, p: Partial<Produto>) => void;
  removerProduto: (id: string) => void;
  duplicarProduto: (id: string) => void;
  reordenarProdutos: (ids: string[]) => void;
  // Banners
  adicionarBanner: (b: Omit<Banner, "id">) => void;
  atualizarBanner: (id: string, b: Partial<Banner>) => void;
  removerBanner: (id: string) => void;
  // Cupons
  adicionarCupom: (c: Cupom) => void;
  atualizarCupom: (codigo: string, c: Partial<Cupom>) => void;
  removerCupom: (codigo: string) => void;
  // Depoimentos
  adicionarDepoimento: (d: Omit<Depoimento, "id">) => void;
  atualizarDepoimento: (id: string, d: Partial<Depoimento>) => void;
  removerDepoimento: (id: string) => void;
  // Categorias
  adicionarCategoria: (c: Omit<Categoria, "id">) => void;
  atualizarCategoria: (id: string, c: Partial<Categoria>) => void;
  removerCategoria: (id: string) => void;
  // Avisos Barra
  setAvisosBarra: (a: AvisoBarra[]) => void;
  // Msgs WhatsApp
  setMsgsWhatsApp: (m: MsgWhatsApp[]) => void;
  // Frete
  setFretesPorRegiao: (f: FretePorRegiao[]) => void;
  // Páginas
  setPaginas: (p: PaginaConteudo[]) => void;
  // Logs
  addLog: (acao: string, detalhes: string) => void;
  // Admins
  setAdmins: (a: AdminUser[]) => void;
  // Config
  atualizarConfig: (c: Partial<ConfigLoja>) => void;
  resetarTudo: () => void;
}

// Defaults importados de @/data/defaults

const LojaContext = createContext<LojaContextType | null>(null);
function gerarId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export function LojaProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosDefault);
  const [banners, setBanners] = useState<Banner[]>(bannersDefault);
  const [cupons, setCupons] = useState<Cupom[]>(cuponsDefault);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(depoimentosDefault);
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasDefault);
  const [avisosBarra, setAvisosBarraState] = useState<AvisoBarra[]>(avisosBarraDefault);
  const [msgsWhatsApp, setMsgsWhatsAppState] = useState<MsgWhatsApp[]>(msgsWhatsAppDefault);
  const [fretesPorRegiao, setFretesPorRegiaoState] = useState<FretePorRegiao[]>(fretesPorRegiaoDefault);
  const [paginas, setPaginasState] = useState<PaginaConteudo[]>(paginasDefault);
  const [logs, setLogs] = useState<LogAtividade[]>([]);
  const [admins, setAdminsState] = useState<AdminUser[]>([]);
  const [config, setConfig] = useState<ConfigLoja>(configDefault);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const VERSAO_DADOS = "4";
    const versaoSalva = localStorage.getItem("loja_versao");
    if (versaoSalva !== VERSAO_DADOS) {
      ["loja_produtos","loja_banners","loja_cupons","loja_depoimentos","loja_config","loja_categorias","loja_avisos","loja_msgs_whatsapp","loja_fretes","loja_paginas","loja_admins"].forEach(k => localStorage.removeItem(k));
      localStorage.setItem("loja_versao", VERSAO_DADOS);
      setLoaded(true);
      return;
    }
    try {
      const load = (key: string) => { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; };
      const p = load("loja_produtos"); if (p) setProdutos(p);
      const b = load("loja_banners"); if (b) setBanners(b);
      const c = load("loja_cupons"); if (c) setCupons(c);
      const d = load("loja_depoimentos"); if (d) setDepoimentos(d);
      const cat = load("loja_categorias"); if (cat) setCategorias(cat);
      const av = load("loja_avisos"); if (av) setAvisosBarraState(av);
      const mw = load("loja_msgs_whatsapp"); if (mw) setMsgsWhatsAppState(mw);
      const fr = load("loja_fretes"); if (fr) setFretesPorRegiaoState(fr);
      const pg = load("loja_paginas"); if (pg) setPaginasState(pg);
      const lg = load("loja_logs"); if (lg) setLogs(lg);
      const ad = load("loja_admins"); if (ad) setAdminsState(ad);
      const cfg = load("loja_config"); if (cfg) setConfig(cfg);
    } catch {}
    setLoaded(true);
  }, []);

  // Auto-save
  useEffect(() => { if (loaded) localStorage.setItem("loja_produtos", JSON.stringify(produtos)); }, [produtos, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_banners", JSON.stringify(banners)); }, [banners, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_cupons", JSON.stringify(cupons)); }, [cupons, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_depoimentos", JSON.stringify(depoimentos)); }, [depoimentos, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_categorias", JSON.stringify(categorias)); }, [categorias, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_avisos", JSON.stringify(avisosBarra)); }, [avisosBarra, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_msgs_whatsapp", JSON.stringify(msgsWhatsApp)); }, [msgsWhatsApp, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_fretes", JSON.stringify(fretesPorRegiao)); }, [fretesPorRegiao, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_paginas", JSON.stringify(paginas)); }, [paginas, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_logs", JSON.stringify(logs.slice(0, 200))); }, [logs, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_admins", JSON.stringify(admins)); }, [admins, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("loja_config", JSON.stringify(config)); }, [config, loaded]);

  const addLog = useCallback((acao: string, detalhes: string) => {
    setLogs(prev => [{ id: gerarId(), acao, detalhes, data: new Date().toISOString() }, ...prev].slice(0, 200));
  }, []);

  // Produtos
  const adicionarProduto = useCallback((p: Omit<Produto, "id" | "criadoEm">) => {
    const novo: Produto = { ...p, id: gerarId(), criadoEm: new Date().toISOString().split("T")[0] };
    setProdutos(prev => [novo, ...prev]);
    addLog("Produto criado", novo.nome);
  }, [addLog]);

  const atualizarProduto = useCallback((id: string, p: Partial<Produto>) => {
    setProdutos(prev => prev.map(prod => prod.id === id ? { ...prod, ...p } : prod));
  }, []);

  const removerProduto = useCallback((id: string) => {
    setProdutos(prev => { const p = prev.find(x => x.id === id); if (p) addLog("Produto removido", p.nome); return prev.filter(x => x.id !== id); });
  }, [addLog]);

  const duplicarProduto = useCallback((id: string) => {
    setProdutos(prev => {
      const original = prev.find(p => p.id === id);
      if (!original) return prev;
      const copia = { ...original, id: gerarId(), nome: `${original.nome} (Cópia)`, criadoEm: new Date().toISOString().split("T")[0] };
      addLog("Produto duplicado", original.nome);
      return [copia, ...prev];
    });
  }, [addLog]);

  const reordenarProdutos = useCallback((ids: string[]) => {
    setProdutos(prev => {
      const map = new Map(prev.map(p => [p.id, p]));
      return ids.map(id => map.get(id)!).filter(Boolean);
    });
  }, []);

  // Banners
  const adicionarBanner = useCallback((b: Omit<Banner, "id">) => { setBanners(prev => [...prev, { ...b, id: gerarId() }]); addLog("Banner criado", b.subtitulo); }, [addLog]);
  const atualizarBanner = useCallback((id: string, b: Partial<Banner>) => { setBanners(prev => prev.map(ban => ban.id === id ? { ...ban, ...b } : ban)); }, []);
  const removerBanner = useCallback((id: string) => { setBanners(prev => prev.filter(b => b.id !== id)); addLog("Banner removido", id); }, [addLog]);

  // Cupons
  const adicionarCupom = useCallback((c: Cupom) => { setCupons(prev => [...prev, c]); addLog("Cupom criado", c.codigo); }, [addLog]);
  const atualizarCupom = useCallback((codigo: string, c: Partial<Cupom>) => { setCupons(prev => prev.map(cup => cup.codigo === codigo ? { ...cup, ...c } : cup)); }, []);
  const removerCupomFn = useCallback((codigo: string) => { setCupons(prev => prev.filter(c => c.codigo !== codigo)); addLog("Cupom removido", codigo); }, [addLog]);

  // Depoimentos
  const adicionarDepoimento = useCallback((d: Omit<Depoimento, "id">) => { setDepoimentos(prev => [...prev, { ...d, id: gerarId() }]); }, []);
  const atualizarDepoimento = useCallback((id: string, d: Partial<Depoimento>) => { setDepoimentos(prev => prev.map(dep => dep.id === id ? { ...dep, ...d } : dep)); }, []);
  const removerDepoimento = useCallback((id: string) => { setDepoimentos(prev => prev.filter(d => d.id !== id)); }, []);

  // Categorias
  const adicionarCategoria = useCallback((c: Omit<Categoria, "id">) => { setCategorias(prev => [...prev, { ...c, id: gerarId() }]); addLog("Categoria criada", c.nome); }, [addLog]);
  const atualizarCategoria = useCallback((id: string, c: Partial<Categoria>) => { setCategorias(prev => prev.map(cat => cat.id === id ? { ...cat, ...c } : cat)); }, []);
  const removerCategoria = useCallback((id: string) => { setCategorias(prev => prev.filter(c => c.id !== id)); addLog("Categoria removida", id); }, [addLog]);

  // Config
  const atualizarConfig = useCallback((c: Partial<ConfigLoja>) => { setConfig(prev => ({ ...prev, ...c })); addLog("Configurações alteradas", Object.keys(c).join(", ")); }, [addLog]);

  const resetarTudo = useCallback(() => {
    setProdutos(produtosDefault); setBanners(bannersDefault); setCupons(cuponsDefault);
    setDepoimentos(depoimentosDefault); setCategorias(categoriasDefault); setConfig(configDefault);
    setAvisosBarraState(avisosBarraDefault); setMsgsWhatsAppState(msgsWhatsAppDefault);
    setFretesPorRegiaoState(fretesPorRegiaoDefault); setPaginasState(paginasDefault);
    setLogs([]); setAdminsState([]);
    ["loja_produtos","loja_banners","loja_cupons","loja_depoimentos","loja_config","loja_categorias","loja_avisos","loja_msgs_whatsapp","loja_fretes","loja_paginas","loja_logs","loja_admins"].forEach(k => localStorage.removeItem(k));
    addLog("Reset total", "Todos os dados foram resetados");
  }, [addLog]);

  return (
    <LojaContext.Provider value={{
      produtos, banners, cupons, depoimentos, categorias, avisosBarra, msgsWhatsApp,
      fretesPorRegiao, paginas, logs, admins, config,
      adicionarProduto, atualizarProduto, removerProduto, duplicarProduto, reordenarProdutos,
      adicionarBanner, atualizarBanner, removerBanner,
      adicionarCupom, atualizarCupom, removerCupom: removerCupomFn,
      adicionarDepoimento, atualizarDepoimento, removerDepoimento,
      adicionarCategoria, atualizarCategoria, removerCategoria,
      setAvisosBarra: setAvisosBarraState, setMsgsWhatsApp: setMsgsWhatsAppState,
      setFretesPorRegiao: setFretesPorRegiaoState, setPaginas: setPaginasState,
      addLog, setAdmins: setAdminsState,
      atualizarConfig, resetarTudo,
    }}>
      {children}
    </LojaContext.Provider>
  );
}

export function useLoja() {
  const ctx = useContext(LojaContext);
  if (!ctx) throw new Error("useLoja precisa estar dentro de LojaProvider");
  return ctx;
}

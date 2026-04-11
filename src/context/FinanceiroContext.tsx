"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Transacao {
  id: string;
  data: string;
  tipo: "Receita" | "Despesa";
  natureza: "Fixo" | "Variável";
  categoria: string;
  subcategoria: string;
  item: string;
  qtd: number;
  valorUn: number;
  metodo: string;
  notas: string;
}

export interface ContaPagar {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  categoria: string;
  recorrente: boolean;
  pago: boolean;
  dataPagamento?: string;
}

export interface CategoriaFinanceira {
  id: string;
  nome: string;
  tipo: "Receita" | "Despesa" | "Ambos";
  natureza: "Fixo" | "Variável";
  subcategorias: string[];
}

interface FinanceiroContextType {
  transacoes: Transacao[];
  contas: ContaPagar[];
  categorias: CategoriaFinanceira[];
  saldoInicial: number;
  capitalGiro: number;
  // Transações
  addTransacao: (t: Omit<Transacao, "id">) => void;
  removeTransacao: (id: string) => void;
  updateTransacao: (id: string, t: Partial<Transacao>) => void;
  // Contas
  addConta: (c: Omit<ContaPagar, "id">) => void;
  removeConta: (id: string) => void;
  updateConta: (id: string, c: Partial<ContaPagar>) => void;
  // Categorias
  addCategoriaFin: (c: Omit<CategoriaFinanceira, "id">) => void;
  removeCategoriaFin: (id: string) => void;
  // Config
  setSaldoInicial: (v: number) => void;
  setCapitalGiro: (v: number) => void;
  // Computed
  getSaldo: () => number;
  getReceitasPeriodo: (inicio: string, fim: string) => number;
  getDespesasPeriodo: (inicio: string, fim: string) => number;
}

const categoriasDefault: CategoriaFinanceira[] = [
  { id: "cf1", nome: "Vendas", tipo: "Receita", natureza: "Variável", subcategorias: ["Loja Online", "WhatsApp", "Presencial"] },
  { id: "cf2", nome: "Materiais", tipo: "Despesa", natureza: "Variável", subcategorias: ["Prata", "Banhos", "Pedras", "Embalagens"] },
  { id: "cf3", nome: "Gastos Fixos", tipo: "Despesa", natureza: "Fixo", subcategorias: ["Aluguel", "Internet", "Energia", "Água"] },
  { id: "cf4", nome: "Marketing", tipo: "Despesa", natureza: "Variável", subcategorias: ["Anúncios", "Influencers", "Fotografia"] },
  { id: "cf5", nome: "Pessoal", tipo: "Despesa", natureza: "Fixo", subcategorias: ["Salários", "Encargos", "Benefícios"] },
  { id: "cf6", nome: "Transporte", tipo: "Despesa", natureza: "Variável", subcategorias: ["Frete", "Correios", "Entregas"] },
  { id: "cf7", nome: "Outros", tipo: "Ambos", natureza: "Variável", subcategorias: ["Manutenção", "Imprevistos"] },
];

const FinanceiroContext = createContext<FinanceiroContextType | null>(null);

function gerarId() { return "F" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

export function FinanceiroProvider({ children }: { children: ReactNode }) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [categorias, setCategorias] = useState<CategoriaFinanceira[]>(categoriasDefault);
  const [saldoInicial, setSaldoInicialState] = useState(0);
  const [capitalGiro, setCapitalGiroState] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const load = (k: string) => { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; };
      const t = load("fin_transacoes"); if (t) setTransacoes(t);
      const c = load("fin_contas"); if (c) setContas(c);
      const cat = load("fin_categorias"); if (cat) setCategorias(cat);
      const si = localStorage.getItem("fin_saldo_inicial"); if (si) setSaldoInicialState(parseFloat(si));
      const cg = localStorage.getItem("fin_capital_giro"); if (cg) setCapitalGiroState(parseFloat(cg));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) localStorage.setItem("fin_transacoes", JSON.stringify(transacoes)); }, [transacoes, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("fin_contas", JSON.stringify(contas)); }, [contas, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("fin_categorias", JSON.stringify(categorias)); }, [categorias, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("fin_saldo_inicial", saldoInicial.toString()); }, [saldoInicial, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("fin_capital_giro", capitalGiro.toString()); }, [capitalGiro, loaded]);

  const addTransacao = useCallback((t: Omit<Transacao, "id">) => {
    setTransacoes(prev => [{ ...t, id: gerarId() }, ...prev]);
  }, []);
  const removeTransacao = useCallback((id: string) => {
    setTransacoes(prev => prev.filter(t => t.id !== id));
  }, []);
  const updateTransacao = useCallback((id: string, t: Partial<Transacao>) => {
    setTransacoes(prev => prev.map(x => x.id === id ? { ...x, ...t } : x));
  }, []);

  const addConta = useCallback((c: Omit<ContaPagar, "id">) => {
    setContas(prev => [...prev, { ...c, id: gerarId() }]);
  }, []);
  const removeConta = useCallback((id: string) => {
    setContas(prev => prev.filter(c => c.id !== id));
  }, []);
  const updateConta = useCallback((id: string, c: Partial<ContaPagar>) => {
    setContas(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  }, []);

  const addCategoriaFin = useCallback((c: Omit<CategoriaFinanceira, "id">) => {
    setCategorias(prev => [...prev, { ...c, id: gerarId() }]);
  }, []);
  const removeCategoriaFin = useCallback((id: string) => {
    setCategorias(prev => prev.filter(c => c.id !== id));
  }, []);

  const setSaldoInicial = useCallback((v: number) => setSaldoInicialState(v), []);
  const setCapitalGiro = useCallback((v: number) => setCapitalGiroState(v), []);

  const getSaldo = useCallback(() => {
    return saldoInicial + transacoes.reduce((acc, t) => acc + (t.tipo === "Receita" ? 1 : -1) * t.qtd * t.valorUn, 0);
  }, [transacoes, saldoInicial]);

  const getReceitasPeriodo = useCallback((inicio: string, fim: string) => {
    return transacoes.filter(t => t.tipo === "Receita" && t.data >= inicio && t.data <= fim).reduce((acc, t) => acc + t.qtd * t.valorUn, 0);
  }, [transacoes]);

  const getDespesasPeriodo = useCallback((inicio: string, fim: string) => {
    return transacoes.filter(t => t.tipo === "Despesa" && t.data >= inicio && t.data <= fim).reduce((acc, t) => acc + t.qtd * t.valorUn, 0);
  }, [transacoes]);

  return (
    <FinanceiroContext.Provider value={{
      transacoes, contas, categorias, saldoInicial, capitalGiro,
      addTransacao, removeTransacao, updateTransacao,
      addConta, removeConta, updateConta,
      addCategoriaFin, removeCategoriaFin,
      setSaldoInicial, setCapitalGiro,
      getSaldo, getReceitasPeriodo, getDespesasPeriodo,
    }}>
      {children}
    </FinanceiroContext.Provider>
  );
}

export function useFinanceiro() {
  const ctx = useContext(FinanceiroContext);
  if (!ctx) throw new Error("useFinanceiro precisa estar dentro de FinanceiroProvider");
  return ctx;
}

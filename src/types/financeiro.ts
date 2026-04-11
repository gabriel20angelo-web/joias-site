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

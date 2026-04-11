export interface Avaliacao {
  id: string;
  nome: string;
  nota: number;
  comentario: string;
  data: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  descricaoCompleta?: string;
  preco: number;
  precoPromocional?: number;
  imagens: string[];
  video?: string;
  categoria: string;
  cores?: string[];
  material?: string;
  peso?: string;
  estoque: number;
  destaque: boolean;
  novo?: boolean;
  maisVendido?: boolean;
  nota?: number;
  avaliacoes?: Avaliacao[];
  criadoEm: string;
}

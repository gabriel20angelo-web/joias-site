export interface Banner {
  id: string;
  subtitulo: string;
  titulo: [string, string];
  descricao: string;
  link: string;
  textoBotao: string;
  bg: string;
  ativo: boolean;
}

export interface Cupom {
  codigo: string;
  desconto: number;
  ativo: boolean;
}

export interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  nota: number;
  produto: string;
}

export interface Categoria {
  id: string;
  nome: string;
  emoji: string;
  descricao: string;
  ativo: boolean;
}

export interface AvisoBarra {
  id: string;
  texto: string;
  ativo: boolean;
}

export interface MsgWhatsApp {
  id: string;
  titulo: string;
  mensagem: string;
}

export interface FretePorRegiao {
  regiao: string;
  valor: number;
  prazo: string;
}

export interface PaginaConteudo {
  id: string;
  titulo: string;
  conteudo: string;
}

export interface LogAtividade {
  id: string;
  acao: string;
  detalhes: string;
  data: string;
}

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "editor";
}

export interface SecaoSite {
  id: string;
  nome: string;
  visivel: boolean;
  subtitulo: string;
  titulo: string;
  descricao: string;
  textoBotao: string;
  imagem: string;
}

export interface ConfigLoja {
  nomeLoja: string;
  tagline: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  email: string;
  freteGratisMinimo: number;
  maxParcelas: number;
  cnpj: string;
  endereco: string;
  horarioFuncionamento: string;
  secoes: SecaoSite[];
}

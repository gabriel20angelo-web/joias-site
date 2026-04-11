import { Banner, Cupom, Depoimento, Categoria, AvisoBarra, MsgWhatsApp, FretePorRegiao, PaginaConteudo, ConfigLoja } from "@/types/loja";
import { CategoriaFinanceira } from "@/types/financeiro";

export const categoriasDefault: Categoria[] = [
  { id: "c1", nome: "Colares", emoji: "📿", descricao: "Elegância para o colo", ativo: true },
  { id: "c2", nome: "Brincos", emoji: "✨", descricao: "Brilho e sofisticação", ativo: true },
  { id: "c3", nome: "Anéis", emoji: "💍", descricao: "Símbolos de estilo", ativo: true },
  { id: "c4", nome: "Pulseiras", emoji: "⌚", descricao: "Charme no pulso", ativo: true },
  { id: "c5", nome: "Conjuntos", emoji: "🎁", descricao: "Combinações perfeitas", ativo: true },
  { id: "c6", nome: "Tornozeleiras", emoji: "💎", descricao: "Delicadeza para os pés", ativo: true },
];

export const bannersDefault: Banner[] = [
  { id: "b1", subtitulo: "Nova Coleção", titulo: ["Pratas com alma", "e luz"], descricao: "Peças em prata com acabamento premium, feitas para eternizar seus momentos mais especiais.", link: "/catalogo", textoBotao: "Explorar Coleção", bg: "#FBF8F3", ativo: true },
  { id: "b2", subtitulo: "Lançamentos", titulo: ["Brilho que", "encanta"], descricao: "Descubra as novidades da nossa coleção. Peças únicas com design contemporâneo.", link: "/catalogo", textoBotao: "Ver Novidades", bg: "#F0E8D8", ativo: true },
  { id: "b3", subtitulo: "Promoções Especiais", titulo: ["Até 30% off", "em peças selecionadas"], descricao: "Aproveite descontos exclusivos em colares, brincos, anéis e muito mais.", link: "/catalogo", textoBotao: "Aproveitar", bg: "#ebe8e3", ativo: true },
];

export const cuponsDefault: Cupom[] = [
  { codigo: "PRIMEIRACOMPRA", desconto: 10, ativo: true },
  { codigo: "JOIAS15", desconto: 15, ativo: true },
  { codigo: "FRETE10", desconto: 10, ativo: true },
];

export const depoimentosDefault: Depoimento[] = [
  { id: "t1", nome: "Isabela R.", texto: "PERFEITO! O conjunto mais lindo que já comprei. Veio numa caixinha maravilhosa.", nota: 5, produto: "Conjunto Lua e Estrela" },
  { id: "t2", nome: "Carolina S.", texto: "Maravilhoso! O brilho é incrível, parece joia de verdade cara.", nota: 5, produto: "Colar Coração Cravejado" },
  { id: "t3", nome: "Amanda F.", texto: "Prata de verdade! Adorei a qualidade, vale cada centavo.", nota: 5, produto: "Pulseira Elos Prateada" },
];

export const avisosBarraDefault: AvisoBarra[] = [
  { id: "av1", texto: "FRETE GRÁTIS ACIMA DE R$${freteGratisMinimo}", ativo: true },
  { id: "av2", texto: "PARCELE EM ATÉ ${maxParcelas}X SEM JUROS", ativo: true },
  { id: "av3", texto: "TROCA GRÁTIS EM ATÉ 7 DIAS", ativo: true },
];

export const msgsWhatsAppDefault: MsgWhatsApp[] = [
  { id: "w1", titulo: "Boas-vindas", mensagem: "Olá! Bem-vinda à AURA MEL ✨ Como posso te ajudar?" },
  { id: "w2", titulo: "Rastreamento", mensagem: "Olá! Seu pedido foi enviado! 📦 Código de rastreio: [CÓDIGO]. Acompanhe em: correios.com.br" },
  { id: "w3", titulo: "Pós-venda", mensagem: "Olá! Tudo bem? Gostaríamos de saber se você recebeu sua peça e se gostou! 💛" },
];

export const fretesPorRegiaoDefault: FretePorRegiao[] = [
  { regiao: "Sudeste", valor: 15.9, prazo: "5-8 dias úteis" },
  { regiao: "Sul", valor: 18.9, prazo: "6-10 dias úteis" },
  { regiao: "Nordeste", valor: 22.9, prazo: "8-12 dias úteis" },
  { regiao: "Centro-Oeste", valor: 20.9, prazo: "7-11 dias úteis" },
  { regiao: "Norte", valor: 25.9, prazo: "10-15 dias úteis" },
];

export const paginasDefault: PaginaConteudo[] = [
  { id: "sobre", titulo: "Sobre Nós", conteudo: "Nascemos da paixão por peças que carregam significado, brilho e personalidade. A AURA MEL é uma marca de joias em prata 925 com banhos de ouro 18k, comprometida em levar elegância e luz para o dia a dia de cada mulher." },
  { id: "politicas", titulo: "Políticas", conteudo: "" },
];

export const configDefault: ConfigLoja = {
  nomeLoja: "AURA MEL",
  tagline: "Pratas com Alma e Luz",
  whatsapp: "5500000000000",
  instagram: "@auramel.pratas",
  tiktok: "@auramel.pratas",
  email: "contato@auramel.com.br",
  freteGratisMinimo: 199,
  maxParcelas: 6,
  cnpj: "",
  endereco: "",
  horarioFuncionamento: "Segunda a Sexta, 9h às 18h",
  secoes: [
    { id: "banner", nome: "Banner Hero", visivel: true, subtitulo: "", titulo: "", descricao: "", textoBotao: "", imagem: "" },
    { id: "beneficios", nome: "Benefícios", visivel: true, subtitulo: "", titulo: "", descricao: "", textoBotao: "", imagem: "" },
    { id: "categorias", nome: "Categorias", visivel: true, subtitulo: "Navegue por", titulo: "Categorias", descricao: "", textoBotao: "", imagem: "" },
    { id: "lancamentos", nome: "Lançamentos", visivel: true, subtitulo: "Acabou de chegar", titulo: "Lançamentos", descricao: "", textoBotao: "Ver todos", imagem: "" },
    { id: "promocao", nome: "Banner Promoção", visivel: true, subtitulo: "Ofertas Especiais", titulo: "Até 30% off em peças selecionadas", descricao: "Aproveite preços especiais em colares, brincos e anéis. Promoção por tempo limitado.", textoBotao: "Ver Promoções", imagem: "" },
    { id: "maisVendidos", nome: "Mais Vendidos", visivel: true, subtitulo: "Campeões de venda", titulo: "Mais Vendidos", descricao: "", textoBotao: "Ver todos", imagem: "" },
    { id: "stats", nome: "Estatísticas", visivel: true, subtitulo: "", titulo: "", descricao: "", textoBotao: "", imagem: "" },
    { id: "destaques", nome: "Destaques", visivel: true, subtitulo: "Os mais amados", titulo: "Destaques", descricao: "", textoBotao: "Ver todos", imagem: "" },
    { id: "depoimentos", nome: "Depoimentos", visivel: true, subtitulo: "O que dizem", titulo: "Nossas Clientes", descricao: "", textoBotao: "", imagem: "" },
    { id: "whatsapp", nome: "CTA WhatsApp", visivel: true, subtitulo: "Atendimento Exclusivo", titulo: "Precisa de ajuda para escolher a peça perfeita?", descricao: "Nossa equipe está pronta para te ajudar via WhatsApp", textoBotao: "Fale Conosco", imagem: "" },
    { id: "todosOsProdutos", nome: "Todos os Produtos", visivel: true, subtitulo: "Coleção Completa", titulo: "Todas as Peças", descricao: "", textoBotao: "", imagem: "" },
    { id: "instagram", nome: "Instagram", visivel: true, subtitulo: "", titulo: "Siga-nos no Instagram", descricao: "", textoBotao: "", imagem: "" },
  ],
};

export const categoriasFinanceirasDefault: CategoriaFinanceira[] = [
  { id: "cf1", nome: "Vendas", tipo: "Receita", natureza: "Variável", subcategorias: ["Loja Online", "WhatsApp", "Presencial"] },
  { id: "cf2", nome: "Materiais", tipo: "Despesa", natureza: "Variável", subcategorias: ["Prata", "Banhos", "Pedras", "Embalagens"] },
  { id: "cf3", nome: "Gastos Fixos", tipo: "Despesa", natureza: "Fixo", subcategorias: ["Aluguel", "Internet", "Energia", "Água"] },
  { id: "cf4", nome: "Marketing", tipo: "Despesa", natureza: "Variável", subcategorias: ["Anúncios", "Influencers", "Fotografia"] },
  { id: "cf5", nome: "Pessoal", tipo: "Despesa", natureza: "Fixo", subcategorias: ["Salários", "Encargos", "Benefícios"] },
  { id: "cf6", nome: "Transporte", tipo: "Despesa", natureza: "Variável", subcategorias: ["Frete", "Correios", "Entregas"] },
  { id: "cf7", nome: "Outros", tipo: "Ambos", natureza: "Variável", subcategorias: ["Manutenção", "Imprevistos"] },
];

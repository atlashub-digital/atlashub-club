import type { IconName } from "@/components/ui/Icon";
import type { Status } from "@/components/ui/primitives";

/**
 * Conteúdo público do Club Atlas.
 * Regras: sem preços, sem métricas inventadas, sem anunciar vagas ou inscrições não confirmadas.
 * Datas de referência (docs/DECISIONS.md): Club introdutório em nov/2026, estreia formal em dez/2026,
 * Genesis Turma 01 em 09/01/2027 (sábado, previsto), Enterprise Lab em 28/11/2026.
 */

export const navigation = [
  { href: "/", label: "Início" },
  { href: "/comunidade", label: "Comunidade" },
  { href: "/genesis", label: "Genesis" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/mentores", label: "Mentores" },
  { href: "/eventos", label: "Eventos" },
  { href: "/lab", label: "Atlas Lab" },
] as const;

/** Pilares do rodapé da composição aprovada (copy ajustada: sem afirmar comunidade já "ativa"). */
export const pillarsBar: { icon: IconName; title: string; detail: string }[] = [
  { icon: "users", title: "Aprendizado prático", detail: "Do zero ao real, no seu ritmo" },
  { icon: "gear", title: "Construção de agentes", detail: "Seu primeiro agente, passo a passo" },
  { icon: "nodes", title: "Comunidade acolhedora", detail: "Ninguém fica para trás" },
  { icon: "rocket", title: "Projetos reais", detail: "Da ideia ao protótipo" },
  { icon: "bulb", title: "Mentoria humana + IA", detail: "Pessoas e inteligência juntas" },
  { icon: "chart", title: "Oportunidades", detail: "Portfólio e próximos passos" },
];

export const audiences: { icon: IconName; title: string; detail: string }[] = [
  { icon: "cap", title: "Estudantes de todas as áreas", detail: "Direito, saúde, engenharia, artes, gestão… A IA ajuda em qualquer curso." },
  { icon: "seed", title: "Iniciantes", detail: "Nunca programou? Ótimo ponto de partida. Explicamos tudo sem jargão." },
  { icon: "sparkle", title: "Criadores", detail: "Conteúdo, design, vídeo e comunicação com um parceiro criativo." },
  { icon: "nodes", title: "Desenvolvedores", detail: "Agentes, integrações e projetos para ir além do tutorial." },
  { icon: "rocket", title: "Pequenos empreendedores", detail: "Catálogo, atendimento e operação com apoio — e sempre com supervisão." },
];

/**
 * Exemplos próximos do público (revisão Sérgio, PR #11 §C). Cenários pedagógicos:
 * marketplaces citados são contexto, NÃO integrações existentes.
 */
export const buildExamples: {
  icon: IconName;
  title: string;
  task: string;
  evidence: string;
  limit: string;
  tone: "cyan" | "gold" | "violet";
}[] = [
  { icon: "cap", title: "Tutor de faculdade", task: "Organiza a matéria da semana e cria exercícios no seu nível.", evidence: "Plano de estudos e 10 questões revisadas por você.", limit: "Não faz provas nem trabalhos por você.", tone: "cyan" },
  { icon: "book", title: "Pesquisa + escrita", task: "Um agente levanta fontes; outro organiza um rascunho com citações.", evidence: "Sumário com fontes verificáveis e a sua versão final.", limit: "Você confere cada fonte e assina o texto.", tone: "violet" },
  { icon: "sparkle", title: "Estúdio criativo de conteúdo", task: "Pauta, roteiro e variações de post para um tema seu.", evidence: "Calendário editorial e três peças aprovadas.", limit: "Nada é publicado sem a sua aprovação.", tone: "gold" },
  { icon: "chart", title: "Operação de loja online", task: "Catálogo, descrições e respostas-modelo para um cenário fictício (Mercado Livre, Shopee ou loja própria).", evidence: "Catálogo de exemplo com 10 produtos e um guia de atendimento.", limit: "Sem integração real com marketplaces; preços e envios ficam com você.", tone: "cyan" },
  { icon: "folder", title: "Acompanhamento de projetos", task: "Quebra um objetivo em etapas, prazos e lembretes.", evidence: "Quadro do projeto e revisão semanal registrada.", limit: "Prioridades e decisões continuam suas.", tone: "violet" },
  { icon: "nodes", title: "Equipe para um micro-negócio", task: "Pesquisa, oferta e protótipo de página coordenados por vários agentes.", evidence: "Protótipo demonstrável e um diário de decisões.", limit: "Sem vendas, pagamentos ou contato com clientes reais.", tone: "gold" },
];

/** Narrativa visual do laboratório — simulação ilustrativa, não um terminal real. */
export const labStages: { icon: IconName; title: string; detail: string; line: string }[] = [
  { icon: "sparkle", title: "Tela vazia", detail: "Uma ideia, um objetivo, uma pergunta.", line: "objetivo: \"organizar meu semestre\"" },
  { icon: "seed", title: "Primeiro agente", detail: "Nome, função, tom e limites.", line: "agente: tutor · tom: paciente · limite: não faz provas" },
  { icon: "brain", title: "Memória e ferramentas", detail: "Contexto que você controla — editar, apagar, testar.", line: "memória: 3 notas · ferramenta: calendário (sandbox)" },
  { icon: "nodes", title: "Uma equipe de agentes", detail: "Pesquisa, planeja, constrói e revisa — coordenados por você.", line: "equipe: pesquisa → plano → revisão · aprovação: você" },
  { icon: "rocket", title: "Primeiro projeto demonstrável", detail: "Um resultado que você mostra, explica e melhora.", line: "entrega: plano v2 · revisado · pronto para apresentar" },
];

/** Níveis de acesso descritos de forma realista (nenhum está ativo hoje). */
export const accessLevels: { name: string; what: string; status: Status; statusLabel: string }[] = [
  { name: "Club", what: "Comunidade e aprendizagem gratuitas de entrada: fóruns, guias e a Missão 001.", status: "prep", statusLabel: "Em preparação" },
  { name: "Atlas Lab", what: "Ambiente experimental progressivo, com quotas, isolamento e supervisão humana. Liberado por etapas.", status: "prep", statusLabel: "Em preparação" },
  { name: "Genesis", what: "Programa guiado de 8 semanas e 24 ateliers, com mentoria e projeto real.", status: "planned", statusLabel: "Previsto 09/01/2027" },
];

export const startSteps: { n: string; title: string; detail: string; status: Status; statusLabel: string }[] = [
  { n: "01", title: "Entre gratuitamente", detail: "Crie sua conta no Club. O registro abre quando privacidade e segurança estiverem validadas.", status: "prep", statusLabel: "Em preparação" },
  { n: "02", title: "Conte seus objetivos", detail: "Um onboarding curto: área de estudo, interesses e equipamento disponível (até só um celular).", status: "prep", statusLabel: "Em preparação" },
  { n: "03", title: "Missão 001 — O meu primeiro agente", detail: "Quatro etapas guiadas para criar, ensinar e testar seu primeiro agente, com evidências reais.", status: "prep", statusLabel: "Em preparação" },
  { n: "04", title: "Participe e construa", detail: "Fóruns abertos, desafios, Build Nights e, em janeiro, a pré-candidatura ao Genesis.", status: "planned", statusLabel: "A partir de nov/2026" },
];

export const mission001: { icon: IconName; step: string; title: string; detail: string }[] = [
  { icon: "seed", step: "Etapa 1", title: "Plantar a semente", detail: "Escolha um objetivo, o contexto e uma primeira tarefa pequena e mensurável." },
  { icon: "id", step: "Etapa 2", title: "Dar identidade", detail: "Nome, função, tom de voz, comportamentos e limites do seu agente." },
  { icon: "brain", step: "Etapa 3", title: "Ensinar contexto", detail: "Três informações consentidas (ou fictícias): editar, apagar e testar a memória." },
  { icon: "trophy", step: "Etapa 4", title: "Primeira realização", detail: "Produzir um resultado, revisar com o objetivo e aprovar a nova versão." },
];

export type ClubEvent = {
  day: string;
  month: string;
  /** Rótulo legível usado na página /eventos. */
  date: string;
  title: string;
  detail: string;
  format: string;
  state: string;
  status: Status;
  /** Club (comunidade) vs workshop executivo externo da AtlasHub.SI. */
  kind: "club" | "genesis" | "b2b";
};

export const events: ClubEvent[] = [
  { day: "NOV", month: "2026", date: "NOV • 2026", title: "Fóruns Abertos do Club", detail: "Sessões introdutórias online: ideias, agentes e projetos. Horários a confirmar.", format: "ONLINE", state: "EM PREPARAÇÃO", status: "prep", kind: "club" },
  { day: "14", month: "NOV", date: "14 NOV", title: "Empresa Aumentada 2027–2030", detail: "Workshop executivo AtlasHub.SI · Anápolis, presencial. Não faz parte do Club.", format: "PRESENCIAL", state: "PREVISTO", status: "external", kind: "b2b" },
  { day: "16", month: "NOV", date: "16 NOV", title: "Clínica de Ideias", detail: "Complemento online do workshop executivo AtlasHub.SI.", format: "ONLINE", state: "PREVISTO", status: "external", kind: "b2b" },
  { day: "28", month: "NOV", date: "28 NOV", title: "Enterprise Lab — E-commerce e Operações Vivas", detail: "Laboratório empresarial AtlasHub.SI · Anápolis, presencial.", format: "PRESENCIAL", state: "PREVISTO", status: "external", kind: "b2b" },
  { day: "DEZ", month: "2026", date: "DEZ • 2026", title: "Estreia oficial do Club Atlas", detail: "Lançamento formal da comunidade e das primeiras missões.", format: "HÍBRIDO", state: "EM PREPARAÇÃO", status: "prep", kind: "club" },
  { day: "09", month: "JAN", date: "09 JAN 2027", title: "Genesis — Turma 01", detail: "Abertura prevista (sábado) · Anápolis + online. Oito semanas, 24 ateliers.", format: "HÍBRIDO", state: "PREVISTO", status: "planned", kind: "genesis" },
];

export const genesisPhases = [
  { n: 1, title: "Fundamentos", weeks: "Semanas 1–2", detail: "Conceitos, ferramentas e mentalidade da nova era com IA." },
  { n: 2, title: "Construção", weeks: "Semanas 3–4", detail: "Seus agentes, fluxos e a estrutura do seu projeto." },
  { n: 3, title: "Projeto", weeks: "Semanas 5–6", detail: "Desenvolver e validar um projeto real com apoio de mentores." },
  { n: 4, title: "Demo Day", weeks: "Semanas 7–8", detail: "Apresentar à comunidade o que você construiu. Data a confirmar." },
];

export const channels: { icon: IconName; title: string; detail: string; status: Status; statusLabel: string }[] = [
  { icon: "chat", title: "Fóruns do Club", detail: "Perguntas, apresentações, projetos e ajuda técnica, com moderação humana.", status: "prep", statusLabel: "Em preparação" },
  { icon: "users", title: "Discord", detail: "Servidor da comunidade com canais por tema e Build Nights.", status: "soon", statusLabel: "Planejado" },
  { icon: "sparkle", title: "Desafios semanais", detail: "Pequenas missões práticas para aprender fazendo, sozinho ou em equipe.", status: "prep", statusLabel: "Em preparação" },
  { icon: "phone", title: "WhatsApp", detail: "Só com adesão voluntária e integração oficial. Ainda em estudo.", status: "soon", statusLabel: "Em estudo" },
];

export const universes = [
  { name: "AtlasHub.SI", tag: "Institucional e empresarial", detail: "Transformação empresarial, AI Workforce e workshops executivos.", href: "https://atlashub.si", cta: "Visitar AtlasHub.SI", external: true },
  { name: "AtlasHub Editions", tag: "Conhecimento e publicações", detail: "Livros, guias e estudos de caso. O Club apresenta o catálogo; a Editions é a editora responsável.", href: "/biblioteca", cta: "Ver na Biblioteca", external: false },
  { name: "Club Atlas", tag: "Comunidade, aprendizagem e projetos", detail: "Estudantes e iniciantes, agentes pessoais, mentores, missões e o programa Genesis.", href: "/participar", cta: "Você está aqui", external: false, current: true },
];

export const faq = [
  { q: "O Club Atlas é pago?", a: "A entrada no Club será gratuita: comunidade, fóruns abertos, guias livres e a Missão 001. Percursos avançados e recursos de laboratório poderão ter condições próprias, que só serão anunciadas depois de aprovadas — nenhum valor está definido hoje." },
  { q: "Preciso saber programar?", a: "Não. Você não precisa saber programar; precisa começar. As missões partem do zero e explicam cada passo. Quem já programa encontra desafios para ir mais longe." },
  { q: "Só tenho celular. Consigo participar?", a: "Sim. Comunidade, conteúdos e a primeira missão funcionam no celular. Algumas atividades avançadas de laboratório podem exigir computador ou recursos remotos — avisaremos sempre antes." },
  { q: "Quando começa?", a: "Sessões introdutórias a partir de novembro de 2026 e estreia formal em dezembro. A Turma 01 do Genesis tem abertura prevista para 09/01/2027." },
  { q: "O Genesis tem vagas ou preço definidos?", a: "Ainda não. A pré-candidatura será aberta em breve, sem cobrança e sem reserva automática de vaga. O programa prevê bolsas, e ninguém fica fora da comunidade por falta de dinheiro." },
  { q: "Os mentores são pessoas reais?", a: "Sérgio Monteiro é uma pessoa real. Atlas, Lucas, Marta e Bia são personagens digitais, sempre identificados como tais, e não tomam decisões sobre você sem supervisão humana." },
  { q: "Como meus dados serão tratados?", a: "Coletamos o mínimo necessário, com consentimento explícito, em conformidade com a LGPD. Você poderá pedir acesso, correção ou exclusão a qualquer momento. Veja o aviso de privacidade." },
];

/* ---- Compatibilidade com páginas existentes (PR2 irá migrá-las) ---- */
export type CardItem = { title: string; detail: string; tag: string; href?: string; status?: string };

export const library = [
  { title: "Empresa Aumentada", category: "ATLAS EDITIONS", description: "Fundamentos da transformação empresarial e do futuro das operações.", access: "REFERÊNCIA EDITORIAL", status: "EDITORIAL EM PREPARAÇÃO" },
  { title: "O E-commerce Aumentado", category: "ATLAS EDITIONS", description: "O comércio digital como uma operação integrada entre pessoas, dados e sistemas.", access: "REFERÊNCIA EDITORIAL", status: "PREVIEW EDITORIAL" },
  { title: "O teu primeiro agente", category: "CLUB ATLAS", description: "Guia introdutório: contexto, objetivos, limites e primeira experiência.", access: "FUTURO FREE", status: "CONTEÚDO A PRODUZIR" },
  { title: "Genesis: Da semente ao ecossistema", category: "ATLAS LAB", description: "Percurso progressivo de oito semanas e desafios colaborativos.", access: "TURMA GENESIS", status: "PROGRAMA EM PREPARAÇÃO" },
];

import { genesisFacts, price } from "@/lib/offers";

/**
 * Guia PRÉ-ESCRITO do Atlas. Não é IA: são respostas fixas, revistas pela equipa e sempre
 * rotuladas na interface como "Guia pré-escrito". Quando o agente Hermes do Club for
 * homologado, estas respostas continuam como atalhos de navegação.
 */
export type GuideTopic = {
  id: string;
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export const guideTopics: GuideTopic[] = [
  {
    id: "club",
    question: "O que é o Club Atlas?",
    answer:
      "É uma comunidade gratuita para aprender e construir com agentes de IA — para estudantes de todas as áreas, iniciantes e criadores. Não precisa saber programar.",
    link: { href: "/#laboratorio-atlas", label: "Ver o laboratório" },
  },
  {
    id: "entrar",
    question: "Como entro no Club?",
    answer:
      "Pelo formulário de adesão: escolha o Club grátis, deixe os dados mínimos e conte a primeira missão do seu agente. Por agora o formulário é uma prévia e não envia dados.",
    link: { href: "/participar", label: "Abrir o formulário" },
  },
  {
    id: "genesis",
    question: "Como funciona o Genesis?",
    answer: `São ${genesisFacts.weeks} semanas e ${genesisFacts.ateliers} ateliers previstos para criar agentes, equipes de agentes e um projeto real, com mentoria. Início previsto ${genesisFacts.start}, ${genesisFacts.format}.`,
    link: { href: "/genesis", label: "Conhecer o Genesis" },
  },
  {
    id: "preco",
    question: "Quanto custa?",
    answer: `O Club é grátis. O Genesis é opcional: ${price.genesisStandard} valor padrão ou ${price.genesisStudent} para estudantes elegíveis, depois de validada a condição. Nada é cobrado nesta fase.`,
    link: { href: "/genesis#investimento", label: "Ver condições" },
  },
  {
    id: "atlas",
    question: "Você é uma IA?",
    answer:
      "Sou o Atlas, a mascote digital do Club. Por enquanto falo só com este guia pré-escrito: a conversa com inteligência artificial chega quando o meu agente estiver ligado com segurança, limites e a sua autorização.",
  },
];

/** Balões contextuais por rota (curtos, discretos, desligáveis). */
export function bubbleFor(pathname: string | null): string {
  if (!pathname || pathname === "/") return "Olá! Quer ver como nasce o seu primeiro agente?";
  if (pathname.startsWith("/genesis")) return "Dúvidas sobre o Genesis? Eu explico as etapas.";
  if (pathname.startsWith("/participar")) return "O Club é grátis. O Genesis é opcional.";
  if (pathname.startsWith("/area-membro")) return "Comece pela Missão 001 — eu acompanho você.";
  if (pathname.startsWith("/lab")) return "Aqui é onde agentes viram equipe.";
  return "Precisa de ajuda para navegar?";
}

export const atlasCopy = {
  intro:
    "Olá! Eu sou o Atlas, a mascote digital do Club. Por enquanto respondo com um guia pré-escrito — a conversa com IA ainda está em preparação. Escolha um tema:",
  offline:
    "Ainda não consigo conversar livremente: o meu agente de IA não está ligado a este site. Escolha um dos temas acima ou visite as páginas indicadas.",
  voice:
    "A voz ainda não está disponível. Quando estiver, eu só vou ouvir depois da sua autorização explícita, e você poderá desligar o microfone a qualquer momento.",
};

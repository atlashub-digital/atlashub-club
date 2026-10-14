import type { StaticImageData } from "next/image";
import sergio from "../../public/assets/club/portrait-sergio.webp";
import lucas from "../../public/assets/club/portrait-lucas.webp";
import atlas from "../../public/assets/club/portrait-atlas.webp";
import clara from "../../public/assets/club/portrait-clara.webp";
import lia from "../../public/assets/club/portrait-lia.webp";

/**
 * Elenco do Club Atlas para a INTERFACE.
 *
 * `displayName` segue a composição aprovada (CLUB_ATLAS_TEAM_VALIDADO.png).
 * `profileId` é o ID persistente em agents/TEAM_MANIFEST.json e NÃO foi alterado:
 * Lucas ↔ club-caio e Lia ↔ club-bia são um mapeamento PROVISÓRIO de UI,
 * pendente de decisão do Sérgio (ver docs/IDENTITY_DECISION.md).
 * Nenhuma integração de agente deve usar `displayName` como chave.
 */
export type CastMember = {
  key: "sergio" | "lucas" | "atlas" | "clara" | "lia";
  profileId: string | null;
  displayName: string;
  role: string;
  keywords: string;
  quote: string;
  summary: string;
  kind: "human" | "digital";
  portrait: StaticImageData;
  portraitAlt: string;
  identityPending?: boolean;
};

export const cast: CastMember[] = [
  {
    key: "sergio",
    profileId: null,
    displayName: "Sérgio Monteiro",
    role: "Mentor humano",
    keywords: "Visão · Estratégia · Vida real",
    quote: "Transformar o presente, construir o futuro, juntos.",
    summary:
      "Empreendedor e conector de pessoas e ideias. Traz a experiência do mundo real, a visão estratégica e a provocação certa para transformar aprendizado em resultados.",
    kind: "human",
    portrait: sergio,
    portraitAlt: "Sérgio Monteiro, mentor humano do Club Atlas, sorrindo com a mão no queixo",
  },
  {
    key: "lucas",
    profileId: "club-caio",
    displayName: "Lucas",
    role: "O builder",
    keywords: "Mão na massa · Tecnologia · Soluções",
    quote: "Vamos construir? Do zero ao extraordinário.",
    summary:
      "Apaixonado por tecnologia, automações e agentes de IA. Explora, testa, erra, ensina e mostra na prática como colocar ideias em funcionamento.",
    kind: "digital",
    portrait: lucas,
    portraitAlt: "Lucas, personagem digital builder do Club Atlas, sorrindo de camiseta preta",
    identityPending: true,
  },
  {
    key: "atlas",
    profileId: "club-atlas",
    displayName: "Atlas",
    role: "O engenheiro-chefe",
    keywords: "Inteligência · Criação · Coordenação",
    quote: "Eu penso, planejo, construo e evoluo com você.",
    summary:
      "A inteligência viva deste ecossistema: propõe, cria e conecta pessoas, agentes e ferramentas. Parceiro de jornada — sempre supervisionado por pessoas.",
    kind: "digital",
    portrait: atlas,
    portraitAlt: "Atlas, mascote digital: um triângulo azul e prateado com rosto sorridente sobre um pedestal luminoso",
  },
  {
    key: "clara",
    profileId: "club-clara",
    displayName: "Clara",
    role: "Mentora de comunidade",
    keywords: "Acolhimento · Organização · Evolução",
    quote: "Juntos tudo é mais simples e mais possível.",
    summary:
      "Comunicativa e organizada, é o elo entre os membros: cuida da comunidade, facilita a jornada e garante que ninguém fique para trás.",
    kind: "digital",
    portrait: clara,
    portraitAlt: "Clara, personagem digital mentora de comunidade, sorrindo com o rosto apoiado na mão",
  },
  {
    key: "lia",
    profileId: "club-bia",
    displayName: "Lia",
    role: "A exploradora",
    keywords: "Curiosidade · Criatividade · Novos horizontes",
    quote: "Se eu consigo, você também consegue.",
    summary:
      "Aprendiz inquieta e apaixonada por inovação. Representa quem está começando e faz as perguntas que todos temos.",
    kind: "digital",
    portrait: lia,
    portraitAlt: "Lia, personagem digital exploradora, de óculos e moletom claro, sorrindo",
    identityPending: true,
  },
];

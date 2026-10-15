/**
 * Ofertas comerciais do Club Atlas — ÚNICA fonte de preços da UI.
 * Origem: decisão do Sérgio (issue #14, 14/10/2026) e contrato candidato
 * design/handoff/club-signup-genesis-v2/04_CONTRATOS_EVENTOS_CANDIDATOS.json.
 *
 * IMPORTANTE: isto é apenas EXIBIÇÃO. Nenhuma cobrança existe; `availability` é
 * "pending_launch". O preço cobrado no futuro virá de uma cotação assinada no servidor —
 * nunca deste ficheiro nem de um valor enviado pelo browser.
 */
export type OfferId = "club-free-v1" | "genesis-01-standard" | "genesis-01-student";

export type Offer = {
  id: OfferId;
  priceMinor: number; // centavos BRL
  availability: "pending_launch";
  eligibilityRequired?: "student_approved";
  durationWeeks?: number;
};

export const offers: Record<OfferId, Offer> = {
  "club-free-v1": { id: "club-free-v1", priceMinor: 0, availability: "pending_launch" },
  "genesis-01-standard": { id: "genesis-01-standard", priceMinor: 49000, availability: "pending_launch", durationWeeks: 8 },
  "genesis-01-student": {
    id: "genesis-01-student",
    priceMinor: 19000,
    availability: "pending_launch",
    eligibilityRequired: "student_approved",
    durationWeeks: 8,
  },
};

/** "R$ 490" — sem centavos quando inteiro. */
export function formatBRL(minor: number): string {
  const reais = minor / 100;
  return `R$ ${Number.isInteger(reais) ? reais.toString() : reais.toFixed(2).replace(".", ",")}`;
}

export const price = {
  club: "Grátis",
  genesisStandard: formatBRL(offers["genesis-01-standard"].priceMinor),
  genesisStudent: formatBRL(offers["genesis-01-student"].priceMinor),
};

export const genesisFacts = {
  weeks: 8,
  ateliers: 24,
  start: "09/01/2027",
  startIso: "2027-01-09",
  format: "Anápolis + online",
};

/**
 * Genesis Early Access (decisão do Sérgio, 15/10/2026).
 * Elegível quem manifestar interesse no Genesis até ao prazo, incluindo quem já falou pelo WhatsApp oficial.
 * Datas e capacidade dos ateliers de dezembro dependem de confirmação logística: NÃO publicar datas aqui.
 */
const earlyAccessDeadline = "30/11/2026";
const earlyAccessBenefit =
  "convite antecipado para 2 ateliers extras e gratuitos em dezembro: um híbrido, em Anápolis e online, e outro online, de preparação dos projetos. Datas a confirmar.";

export const earlyAccess = {
  deadline: earlyAccessDeadline,
  benefit: earlyAccessBenefit,
  summary: `Quem registrar interesse no Genesis até ${earlyAccessDeadline} recebe ${earlyAccessBenefit} Também recebe primeiro as notícias sobre a abertura das matrículas e as condições definitivas.`,
  fine: "Participação sujeita a confirmação e capacidade disponível. Registrar interesse não é matrícula: não reserva vaga, não tem desconto adicional nem obrigação de compra.",
};

/** Os 2 ateliers extras do Early Access (formato decidido; datas, horários e local a confirmar). */
export const earlyAccessAteliers: { title: string; format: string; detail: string }[] = [
  {
    title: "Atelier extra 1 · Primeiro agente em grupo",
    format: "Híbrido: Anápolis + online",
    detail: "Encontro para conhecer a turma, os mentores e criar juntos um primeiro agente, com participação presencial em Anápolis ou a distância.",
  },
  {
    title: "Atelier extra 2 · Preparação dos projetos",
    format: "Online",
    detail: "Sessão para escolher e preparar a ideia de projeto que você vai desenvolver nas 8 semanas do Genesis.",
  },
];

/** Linha do tempo pública do Genesis Turma 01 (sem datas não decididas). */
export const genesisTimeline: { when: string; what: string }[] = [
  { when: `Até ${earlyAccessDeadline}`, what: "Registro de interesse no Genesis (WhatsApp oficial hoje; pela conta do Club quando o cadastro abrir)." },
  { when: "Dezembro de 2026", what: "2 ateliers extras e gratuitos do Early Access, com datas confirmadas por convite." },
  { when: "Antes da abertura", what: "Publicação das condições definitivas: pagamento, cancelamento e reembolso. Só então há matrícula." },
  { when: genesisFacts.start, what: `Início previsto da Turma 01: ${genesisFacts.weeks} semanas, ${genesisFacts.ateliers} ateliers, ${genesisFacts.format}.` },
];

/** Avisos obrigatórios que acompanham sempre um preço. */
export const priceNotes = {
  student: "Condição para estudantes elegíveis, sujeita a validação antes de qualquer pagamento.",
  noCharge: "Nenhuma cobrança nesta fase. Condições comerciais finais serão confirmadas antes da abertura.",
  noInstallments: "Sem parcelamento, taxas ou vagas anunciadas até homologação.",
};

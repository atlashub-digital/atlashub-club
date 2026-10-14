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

/** Avisos obrigatórios que acompanham sempre um preço. */
export const priceNotes = {
  student: "Condição para estudantes elegíveis, sujeita a validação antes de qualquer pagamento.",
  noCharge: "Nenhuma cobrança nesta fase. Condições comerciais finais serão confirmadas antes da abertura.",
  noInstallments: "Sem parcelamento, taxas ou vagas anunciadas até homologação.",
};

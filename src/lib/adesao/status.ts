/**
 * Estados da adesão (SPEC 01 + decisão do Sérgio de 14/10/2026 sobre menores).
 *
 * Duas revisões manuais INDEPENDENTES:
 *  - guardian: pessoa menor de 18 anos → autorização de responsável legal, tratada pela equipa;
 *  - student:  pedido da condição de estudante (R$ 190) → validação de elegibilidade no backend.
 * Uma não substitui a outra: um menor estudante precisa das duas.
 *
 * Nesta prévia o estado é só calculado e mostrado; nada é enviado nem guardado.
 * No sistema real o estado é decidido no servidor (PR2B/PR2C), nunca pelo browser.
 */
import { price } from "@/lib/offers";

export type AgeBand = "adult" | "teen" | "child";
export type Plan = "club" | "genesis";

export type SignupStatus =
  /** Adulto, Club gratuito: conta criada após verificação de e-mail. */
  | "club_free"
  /** Adulto, Genesis sem pedido de estudante: pré-candidatura registada, sem cobrança. */
  | "genesis_interest"
  /** Adulto, Genesis com pedido de estudante: aguarda validação de elegibilidade. */
  | "student_pending"
  /** Menor de 18: aguarda revisão manual da autorização do responsável antes de ativar a conta ou o Genesis. */
  | "pending_guardian_review";

export type ReviewFlags = { guardian: boolean; student: boolean };

export type SignupOutcome = {
  status: SignupStatus;
  reviews: ReviewFlags;
  /** Tudo o que fica retido até as revisões aplicáveis estarem concluídas. */
  onHold: string[];
};

export const ageBandLabels: Record<AgeBand, string> = {
  adult: "18 anos ou mais",
  teen: "Entre 12 e 17 anos",
  child: "Menos de 12 anos",
};

export const statusLabels: Record<SignupStatus, string> = {
  club_free: "Club gratuito",
  genesis_interest: "Interesse no Genesis registado",
  student_pending: "Condição de estudante em validação",
  pending_guardian_review: "Revisão do responsável pendente",
};

export function isMinor(age: AgeBand): boolean {
  return age !== "adult";
}

export function deriveSignupOutcome(input: { plan: Plan; student: boolean; age: AgeBand }): SignupOutcome {
  const reviews: ReviewFlags = {
    guardian: isMinor(input.age),
    student: input.plan === "genesis" && input.student,
  };
  const onHold: string[] = [];
  if (reviews.guardian) {
    onHold.push("Criação de conta com dados pessoais", "Áreas com registro ou dados pessoais");
    if (input.plan === "genesis") onHold.push("Pré-candidatura Genesis, matrícula e qualquer cobrança");
  }
  if (reviews.student) onHold.push(`Valor de estudante (${price.genesisStudent}) até validação de elegibilidade`);

  const status: SignupStatus = reviews.guardian
    ? "pending_guardian_review"
    : reviews.student
      ? "student_pending"
      : input.plan === "genesis"
        ? "genesis_interest"
        : "club_free";

  return { status, reviews, onHold };
}

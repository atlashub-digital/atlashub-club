/**
 * Validação do pedido de adesão — dados mínimos (SPEC 01 §2): sem CPF/RG/documentos.
 * Espelha os campos de src/components/adesao/AdesaoForm.tsx. O cliente nunca envia preços:
 * o plano é só uma intenção; ofertas e cotações são resolvidas no servidor (PR2C).
 */
import type { AgeBand } from "@/lib/adesao/status";

export const TERMS_VERSION = "club-terms-draft-2026-10";
export const PRIVACY_VERSION = "club-privacy-draft-2026-10";

export const AREAS = [
  "Ainda não estou estudando",
  "Saúde",
  "Direito e humanas",
  "Engenharia e tecnologia",
  "Gestão, economia e negócios",
  "Artes, design e comunicação",
  "Educação",
  "Outra área",
] as const;

export const INTERESTS = [
  "Agente pessoal para estudar",
  "Pesquisa e escrita",
  "Criação de conteúdo",
  "Negócio ou loja online",
  "Programação e automações",
  "Comunidade e projetos em equipe",
] as const;

export const DEVICES = ["Só celular", "Computador", "Equipamento compartilhado"] as const;
export const AGE_BANDS = ["adult", "teen", "child"] as const satisfies readonly AgeBand[];

export type SignupInput = {
  plan: "club" | "genesis";
  /** Intenção declarada; só vale após revisão humana (PR2C). */
  studentIntent: boolean;
  displayName: string;
  email: string;
  /** Menores não são bloqueados: seguem para `pending_guardian_review` (decisão de 14/10/2026). */
  ageBand: AgeBand;
  area?: (typeof AREAS)[number];
  interests: (typeof INTERESTS)[number][];
  firstMission?: string;
  device?: (typeof DEVICES)[number];
  termsVersion: string;
  privacyVersion: string;
  /** Opt-in separado; ausente ou diferente de true → false. */
  marketingOptIn: boolean;
};

export type SignupResult = { ok: true; value: SignupInput } | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const has = <T extends string>(list: readonly T[], v: string): v is T => (list as readonly string[]).includes(v);

export function validateSignup(raw: unknown): SignupResult {
  const b = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const plan = str(b.plan);
  if (plan !== "club" && plan !== "genesis") errors.plan = "invalid";

  const displayName = str(b.displayName).replace(/\s+/g, " ");
  if (displayName.length < 2 || displayName.length > 60) errors.displayName = "invalid";

  const email = str(b.email).toLowerCase();
  if (email.length > 190 || !EMAIL.test(email)) errors.email = "invalid";

  const ageBand = str(b.ageBand);
  if (!has(AGE_BANDS, ageBand)) errors.ageBand = "invalid";

  const area = str(b.area);
  if (area && !has(AREAS, area)) errors.area = "invalid";

  const interests = Array.isArray(b.interests) ? b.interests.map(str) : [];
  if (interests.length > INTERESTS.length || interests.some((i) => !has(INTERESTS, i))) errors.interests = "invalid";

  const firstMission = str(b.firstMission);
  if (firstMission.length > 280) errors.firstMission = "too_long";

  const device = str(b.device);
  if (device && !has(DEVICES, device)) errors.device = "invalid";

  if (b.termsVersion !== TERMS_VERSION) errors.termsVersion = "terms_required";
  if (b.privacyVersion !== PRIVACY_VERSION) errors.privacyVersion = "privacy_required";

  // Nenhum campo de preço, CPF, telefone ou documento é aceite.
  for (const k of ["price", "amount", "cpf", "rg", "document", "whatsapp", "phone"]) {
    if (k in b) errors[k] = "not_allowed";
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      plan: plan as SignupInput["plan"],
      studentIntent: plan === "genesis" && b.studentIntent === true,
      displayName,
      email,
      ageBand: ageBand as AgeBand,
      area: area ? (area as SignupInput["area"]) : undefined,
      interests: [...new Set(interests)] as SignupInput["interests"],
      firstMission: firstMission || undefined,
      device: device ? (device as SignupInput["device"]) : undefined,
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
      // Nenhuma comunicação de marketing a menores antes da revisão do responsável.
      marketingOptIn: ageBand === "adult" && b.marketingOptIn === true,
    },
  };
}

/** Forma guardada no convite do Supabase Auth (sem o e-mail, que vem do próprio utilizador). */
export type StoredSignup = Omit<SignupInput, "email">;

export function storedSignup(v: SignupInput): StoredSignup {
  const { email: _email, ...rest } = v;
  return rest;
}

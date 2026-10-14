import { createHash } from "node:crypto";
import { clubAuthMode } from "./mode";
import { createMemoryRateLimiter, type RateLimiter } from "./rate-limit";
import { validateSignup } from "./signup-schema";
import { deriveSignupOutcome } from "@/lib/adesao/status";

/**
 * Lógica do POST /api/club/signup, separada da rota para ser testável sem servidor.
 * Nunca persiste nada neste PR: em "dry-run" devolve o plano de escrita (tabelas e campos),
 * com o email reduzido a um hash, para auditoria.
 */
export type HandlerResult = { status: number; body: Record<string, unknown>; headers?: Record<string, string> };

const perIp = createMemoryRateLimiter(5, 10 * 60_000);
const perEmail = createMemoryRateLimiter(3, 60 * 60_000);
const MAX_BYTES = 4096;

const sha = (v: string) => createHash("sha256").update(v).digest("hex").slice(0, 16);

export async function handleSignup(
  req: { headers: Headers; text(): Promise<string> },
  env: Record<string, string | undefined> = process.env,
  limiters: { ip: RateLimiter; email: RateLimiter } = { ip: perIp, email: perEmail },
): Promise<HandlerResult> {
  if (clubAuthMode(env) === "off") return { status: 503, body: { message: "Adesão ainda não disponível." } };

  const origin = env.CLUB_SITE_ORIGIN;
  if (!origin || req.headers.get("origin") !== origin) return { status: 403, body: { message: "Pedido inválido." } };
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return { status: 415, body: { message: "Formato inválido." } };

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const ipHit = limiters.ip.hit(sha(ip));
  if (!ipHit.allowed)
    return { status: 429, body: { message: "Muitas tentativas." }, headers: { "retry-after": String(ipHit.retryAfterS) } };

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return { status: 413, body: { message: "Pedido demasiado grande." } };
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { status: 400, body: { message: "Pedido inválido." } };
  }
  // Honeypot: resposta neutra, sem revelar deteção.
  if (json && typeof json === "object" && (json as Record<string, unknown>).website)
    return { status: 202, body: { dryRun: true } };

  const parsed = validateSignup(json);
  if (!parsed.ok) return { status: 400, body: { message: "Verifique os dados.", errors: parsed.errors } };

  const v = parsed.value;
  const emailHit = limiters.email.hit(sha(v.email));
  // Resposta neutra por email para não permitir enumeração de contas.
  if (!emailHit.allowed) return { status: 202, body: { dryRun: true } };

  const outcome = deriveSignupOutcome({ plan: v.plan, student: v.studentIntent, age: v.ageBand });

  // Menores: nenhuma conta, perfil, consentimento ou CRM antes da revisão manual do responsável.
  // Adolescente (12–17): só um pedido de revisão com contacto mínimo e prazo de expiração.
  // Criança (<12): o e-mail da criança é descartado; a equipa pede o contacto do responsável.
  if (outcome.reviews.guardian) {
    const child = v.ageBand === "child";
    return {
      status: 202,
      body: {
        dryRun: true,
        message: "Simulação: nada foi gravado nem enviado.",
        status: outcome.status,
        reviews: outcome.reviews,
        wouldWrite: [
          {
            table: "club.club_guardian_reviews",
            fields: [
              "status=pending_guardian_review",
              `age_band=${v.ageBand}`,
              "plan",
              "student_intent",
              child ? "contact_email=null (descartado; pedir contacto do responsável)" : "contact_email",
              "expires_at=+30d",
            ],
          },
        ],
        withheld: ["auth.users", "club.club_profiles", "club.club_consent_events", "club.club_crm_outbox", "club.club_genesis_applications"],
        ...(child ? {} : { emailHash: sha(v.email) }),
      },
    };
  }

  return {
    status: 202,
    body: {
      dryRun: true,
      message: "Simulação: nada foi gravado nem enviado.",
      status: outcome.status,
      reviews: outcome.reviews,
      wouldWrite: [
        { table: "auth.users", note: "convite por email com verificação obrigatória (Supabase Auth)" },
        { table: "club.club_profiles", fields: ["display_name", "age_band", "area", "device"] },
        { table: "club.club_signup_intents", fields: ["plan", "student_intent", "interests", "first_mission"] },
        {
          table: "club.club_consent_events",
          rows: [
            { kind: "terms", version: v.termsVersion, granted: true },
            { kind: "privacy", version: v.privacyVersion, granted: true },
            { kind: "marketing", granted: v.marketingOptIn },
          ],
        },
        ...(v.plan === "genesis"
          ? [{ table: "club.club_genesis_applications", fields: ["status=interested", "student_intent"] }]
          : []),
        ...(v.marketingOptIn ? [{ table: "club.club_crm_outbox", note: "só com opt-in; sem dados pedagógicos" }] : []),
      ],
      emailHash: sha(v.email),
    },
  };
}

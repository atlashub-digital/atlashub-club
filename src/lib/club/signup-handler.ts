import type { ClubBackend } from "./backend";
import { clientIp, sha } from "./hash";
import { clubAuthMode } from "./mode";
import { createMemoryRateLimiter, type RateLimiter } from "./rate-limit";
import { validateSignup } from "./signup-schema";
import { deriveSignupOutcome } from "@/lib/adesao/status";

/**
 * Lógica do POST /api/club/signup, separada da rota para ser testável sem servidor.
 * - "dry-run": devolve o plano de escrita (tabelas e campos), com o email reduzido a um hash. Nunca persiste.
 * - "live": Turnstile + rate limit partilhado (SQL) e pedido de link de confirmação ao Supabase Auth.
 *   Nenhuma conta fica ativa nem perfil é criado antes de a pessoa confirmar o e-mail
 *   (src/app/api/club/auth/verify). Menores: só um pedido de revisão do responsável, sem conta.
 */
export type HandlerResult = { status: number; body: Record<string, unknown>; headers?: Record<string, string> };

const perIp = createMemoryRateLimiter(5, 10 * 60_000);
const perEmail = createMemoryRateLimiter(3, 60 * 60_000);
const MAX_BYTES = 4096;

const unavailable: HandlerResult = { status: 503, body: { message: "Registo temporariamente indisponível. Tente de novo mais tarde." } };
const checkEmail: HandlerResult = { status: 202, body: { ok: true, next: "check_email" } };

export async function handleSignup(
  req: { headers: Headers; text(): Promise<string> },
  env: Record<string, string | undefined> = process.env,
  limiters: { ip: RateLimiter; email: RateLimiter } = { ip: perIp, email: perEmail },
  backend?: ClubBackend,
): Promise<HandlerResult> {
  const mode = clubAuthMode(env);
  if (mode === "off") return { status: 503, body: { message: "Adesão ainda não disponível." } };
  if (mode === "live") {
    if (!backend) return unavailable;
    try {
      return await handleLive(req, env, backend);
    } catch (e) {
      console.error("club.signup", e instanceof Error ? e.message : "erro");
      return unavailable;
    }
  }

  const origin = env.CLUB_SITE_ORIGIN;
  if (!origin || req.headers.get("origin") !== origin) return { status: 403, body: { message: "Pedido inválido." } };
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return { status: 415, body: { message: "Formato inválido." } };

  const ip = clientIp(req.headers);
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
  // Resposta neutra por email para não permitir enumeração de contas. Criança: não há e-mail.
  if (v.email !== null && !limiters.email.hit(sha(v.email)).allowed) return { status: 202, body: { dryRun: true } };

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
        ...(v.email === null ? {} : { emailHash: sha(v.email) }),
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
      emailHash: sha(v.email!),
    },
  };
}

async function handleLive(
  req: { headers: Headers; text(): Promise<string> },
  env: Record<string, string | undefined>,
  backend: ClubBackend,
): Promise<HandlerResult> {
  const origin = env.CLUB_SITE_ORIGIN?.replace(/\/$/, "");
  if (!origin || req.headers.get("origin") !== origin) return { status: 403, body: { message: "Pedido inválido." } };
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return { status: 415, body: { message: "Formato inválido." } };

  const ip = clientIp(req.headers);
  // Limite por IP mais largo do que no dry-run: escolas e universidades partilham IP.
  if (!(await backend.hitRateLimit(`signup:ip:${sha(ip)}`, 10, 600)))
    return { status: 429, body: { message: "Muitas tentativas. Aguarde alguns minutos." }, headers: { "retry-after": "600" } };

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return { status: 413, body: { message: "Pedido demasiado grande." } };
  let json: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    json = parsed as Record<string, unknown>;
  } catch {
    return { status: 400, body: { message: "Pedido inválido." } };
  }
  if (json.website) return checkEmail; // honeypot: resposta neutra

  const { turnstileToken, ...fields } = json;
  const parsed = validateSignup(fields);
  if (!parsed.ok) return { status: 400, body: { message: "Verifique os dados.", errors: parsed.errors } };
  const v = parsed.value;

  if (typeof turnstileToken !== "string" || !(await backend.verifyTurnstile(turnstileToken, ip)))
    return { status: 400, body: { message: "Não foi possível confirmar que você não é um robô. Tente de novo.", errors: { turnstile: "failed" } } };

  // Resposta neutra por e-mail para não permitir enumeração de contas.
  if (v.email !== null && !(await backend.hitRateLimit(`signup:email:${sha(v.email)}`, 3, 3600))) return checkEmail;

  const outcome = deriveSignupOutcome({ plan: v.plan, student: v.studentIntent, age: v.ageBand });
  if (outcome.reviews.guardian) {
    await backend.createGuardianReview({
      ageBand: v.ageBand as "teen" | "child",
      plan: v.plan,
      studentIntent: v.studentIntent,
      contactEmail: v.email, // null para criança
    });
    return { status: 202, body: { ok: true, next: "guardian_review", status: outcome.status, child: v.ageBand === "child" } };
  }

  if ((await backend.sendLink(v.email!, v)) === "rate_limited")
    return { status: 429, body: { message: "Muitos e-mails enviados agora. Tente de novo em alguns minutos." } };
  return { status: 202, body: { ok: true, next: "check_email", status: outcome.status } };
}
